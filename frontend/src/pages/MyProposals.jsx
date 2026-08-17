import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getMyProposals,
    withdrawProposal
} from "../services/proposalService";


function MyProposals() {

    const { user } = useAuth();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadProposals = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyProposals();

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to load proposals"
                );

                return;
            }

            setProposals(
                data.proposals || []
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to reach server"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (user?.id) {
            loadProposals();
        }

    }, [user]);


    const handleWithdraw = async (proposalId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to withdraw this proposal?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const response =
                await withdrawProposal(
                    proposalId
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to withdraw proposal"
                );

                return;
            }


            setProposals(
                (previousProposals) =>
                    previousProposals.map(
                        (proposal) =>
                            proposal._id === proposalId
                                ? data.proposal
                                : proposal
                    )
            );


            alert(
                "Proposal withdrawn successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );
        }
    };


    if (loading) {
        return (
            <p>
                Loading proposals...
            </p>
        );
    }


    if (error) {
        return (
            <p>
                {error}
            </p>
        );
    }


    return (
        <div>

            <h1>
                My Proposals
            </h1>


            {proposals.length === 0 ? (

                <p>
                    You have not submitted
                    any proposals yet.
                </p>

            ) : (

                proposals.map(
                    (proposal) => (

                        <div
                            key={proposal._id}
                        >

                            <h3>
                                {proposal.project?.title ||
                                    "Project"}
                            </h3>

                            <p>
                                Bid: ₹
                                {proposal.bidAmount}
                            </p>

                            <p>
                                Status:{" "}
                                {proposal.status}
                            </p>

                            <p>
                                Cover Letter:
                            </p>

                            <p>
                                {proposal.coverLetter}
                            </p>


                            {proposal.status ===
                                "pending" && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleWithdraw(
                                            proposal._id
                                        )
                                    }
                                >
                                    Withdraw Proposal
                                </button>

                            )}

                            <hr />

                        </div>

                    )
                )

            )}

        </div>
    );
}

export default MyProposals;