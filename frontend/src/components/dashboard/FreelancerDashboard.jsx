import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiRequest from "../../services/apiRequest";
import StatCard from "./StatCard";


function FreelancerDashboard() {

    const { user } = useAuth();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadProposals = async () => {

            try {

                const response =
                    await apiRequest(
                        "/proposals/my"
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load dashboard"
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


        if (user?.id) {
            loadProposals();
        }

    }, [user]);


    if (loading) {
        return <p>Loading dashboard...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    const pending = proposals.filter(
        (proposal) =>
            proposal.status === "pending"
    );


    const accepted = proposals.filter(
        (proposal) =>
            proposal.status === "accepted"
    );


    const rejected = proposals.filter(
        (proposal) =>
            proposal.status === "rejected"
    );


    const withdrawn = proposals.filter(
        (proposal) =>
            proposal.status === "withdrawn"
    );


    return (
        <div>

            <h1>
                Welcome, {user?.name}
            </h1>

            <p>
                Freelancer Dashboard
            </p>


            <div>

                <StatCard
                    title="Total Proposals"
                    value={proposals.length}
                />

                <StatCard
                    title="Pending"
                    value={pending.length}
                />

                <StatCard
                    title="Accepted"
                    value={accepted.length}
                />

                <StatCard
                    title="Rejected"
                    value={rejected.length}
                />

                <StatCard
                    title="Withdrawn"
                    value={withdrawn.length}
                />

            </div>

        </div>
    );
}

export default FreelancerDashboard;