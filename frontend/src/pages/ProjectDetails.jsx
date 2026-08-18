import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    getProject,
    updateProject,
    deleteProject
} from "../services/projectService";

import {
    submitProposal,
    getProjectProposals,
    updateProposalStatus
} from "../services/proposalService";

import {
    getProjectReviews
} from "../services/reviewService";

import ProposalForm from "../components/projects/ProposalForm";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";
import RatingSummary from "../components/reviews/RatingSummary";

// ✅ NEW IMPORT – extracted components
import EditProjectForm from "../components/projects/EditProjectForm";
import ProjectProposals from "../components/projects/ProjectProposals";


function ProjectDetails() {

    const { projectId } = useParams();
    const { user } = useAuth();


    // --------------------------------------------------
    // PROJECT
    // --------------------------------------------------

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // --------------------------------------------------
    // EDIT PROJECT
    // --------------------------------------------------

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [updating, setUpdating] = useState(false);


    // --------------------------------------------------
    // PROPOSAL
    // --------------------------------------------------

    const [proposalProjectId, setProposalProjectId] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [submittingProposal, setSubmittingProposal] = useState(false);


    // --------------------------------------------------
    // PROPOSALS
    // --------------------------------------------------

    const [proposals, setProposals] = useState([]);
    const [viewingProposals, setViewingProposals] = useState(false);
    const [loadingProposals, setLoadingProposals] = useState(false);


    // --------------------------------------------------
    // REVIEWS
    // --------------------------------------------------

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);


    // --------------------------------------------------
    // LOAD PROJECT
    // --------------------------------------------------

    useEffect(() => {

        const loadProject = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getProject(projectId);
                const data = await response.json();

                if (!response.ok) {

                    setError(
                        data.message ||
                        "Unable to load project"
                    );

                    return;
                }

                setProject(data.project);

            } catch (error) {

                console.error(error);
                setError("Unable to reach server");

            } finally {

                setLoading(false);

            }
        };

        loadProject();

    }, [projectId]);


    // --------------------------------------------------
    // LOAD REVIEWS
    // --------------------------------------------------

    const loadReviews = async () => {

        try {

            setLoadingReviews(true);

            const response = await getProjectReviews(projectId);
            const data = await response.json();

            if (!response.ok) {

                console.error(
                    data.message ||
                    "Unable to load reviews"
                );

                return;
            }

            const projectReviews = data.reviews || [];
            setReviews(projectReviews);
            setTotalReviews(projectReviews.length);

            const totalRating = projectReviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );

            const average = projectReviews.length
                ? totalRating / projectReviews.length
                : 0;

            setAverageRating(Number(average.toFixed(2)));

        } catch (error) {

            console.error("Unable to load reviews:", error);

        } finally {

            setLoadingReviews(false);

        }
    };

    useEffect(() => {
        loadReviews();
    }, [projectId]);


    // --------------------------------------------------
    // PROJECT OWNER
    // --------------------------------------------------

    const isProjectOwner =
        user?.role === "client" &&
        project?.client?._id === user?.id;


    // --------------------------------------------------
    // EDIT PROJECT
    // --------------------------------------------------

    const handleStartEdit = () => {

        setTitle(project.title);
        setDescription(project.description);
        setBudget(project.budget);
        setEditing(true);
    };

    const handleCancelEdit = () => {

        setEditing(false);
        setTitle("");
        setDescription("");
        setBudget("");
    };

    const handleUpdateProject = async (event) => {

        event.preventDefault();

        try {

            setUpdating(true);

            const response = await updateProject(
                projectId,
                { title, description, budget }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to update project"
                );

                return;
            }

            setProject(data.project);
            setEditing(false);
            setTitle("");
            setDescription("");
            setBudget("");

            alert("Project updated successfully");

        } catch (error) {

            console.error(error);
            alert("Unable to reach server");

        } finally {

            setUpdating(false);

        }
    };


    // --------------------------------------------------
    // DELETE PROJECT
    // --------------------------------------------------

    const handleDeleteProject = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await deleteProject(projectId);
            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete project"
                );

                return;
            }

            alert("Project deleted successfully");
            window.history.back();

        } catch (error) {

            console.error(error);
            alert("Unable to reach server");
        }
    };


    // --------------------------------------------------
    // SUBMIT PROPOSAL
    // --------------------------------------------------

    const handleSubmitProposal = async (event) => {

        event.preventDefault();

        try {

            setSubmittingProposal(true);

            const response = await submitProposal({
                project: proposalProjectId,
                bidAmount,
                coverLetter
            });

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to submit proposal"
                );

                return;
            }

            alert("Proposal submitted successfully");

            setProposalProjectId(null);
            setBidAmount("");
            setCoverLetter("");

        } catch (error) {

            console.error(error);
            alert("Unable to reach server");

        } finally {

            setSubmittingProposal(false);

        }
    };


    // --------------------------------------------------
    // VIEW PROPOSALS
    // --------------------------------------------------

    const handleViewProposals = async () => {

        try {

            setLoadingProposals(true);
            setViewingProposals(true);

            const response = await getProjectProposals(projectId);
            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to load proposals"
                );

                return;
            }

            setProposals(data.proposals);

        } catch (error) {

            console.error(error);
            alert("Unable to reach server");

        } finally {

            setLoadingProposals(false);

        }
    };


    // --------------------------------------------------
    // ACCEPT / REJECT PROPOSAL
    // --------------------------------------------------

    const handleProposalStatus = async (proposalId, status) => {

        try {

            const response = await updateProposalStatus(proposalId, status);
            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to update proposal"
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
                status === "accepted"
                    ? "Proposal accepted"
                    : "Proposal rejected"
            );

        } catch (error) {

            console.error(error);
            alert("Unable to reach server");
        }
    };


    // --------------------------------------------------
    // REVIEW CREATED
    // --------------------------------------------------

    const handleReviewCreated = (review) => {

        setReviews((previousReviews) => [...previousReviews, review]);
        setTotalReviews((previousTotal) => previousTotal + 1);

        const newTotal = totalReviews + 1;
        const newAverage = (
            (averageRating * totalReviews) + review.rating
        ) / newTotal;

        setAverageRating(Number(newAverage.toFixed(2)));
        setShowReviewForm(false);
    };


    // --------------------------------------------------
    // LOADING / ERROR
    // --------------------------------------------------

    if (loading) {
        return <p>Loading project...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div>

            <h1>{project.title}</h1>

            <p>{project.description}</p>

            <p>Budget: ₹{project.budget}</p>

            <p>Status: {project.status}</p>

            <p>Client: {project.client?.name || "Unknown"}</p>

            <p>Freelancer: {project.freelancer?.name || "Not hired"}</p>


            {/* ---------------------------------------- */}
            {/* CLIENT ACTIONS */}
            {/* ---------------------------------------- */}

            {isProjectOwner && (
                <div>
                    <h3>Project Management</h3>

                    {!editing ? (
                        <>
                            <button type="button" onClick={handleStartEdit}>
                                Edit
                            </button>

                            {!project.freelancer && (
                                <button type="button" onClick={handleDeleteProject}>
                                    Delete
                                </button>
                            )}

                            <button type="button" onClick={handleViewProposals}>
                                View Proposals
                            </button>
                        </>
                    ) : (
                        <EditProjectForm
                            title={title}
                            description={description}
                            budget={budget}
                            updating={updating}
                            setTitle={setTitle}
                            setDescription={setDescription}
                            setBudget={setBudget}
                            handleUpdateProject={handleUpdateProject}
                            handleCancelEdit={handleCancelEdit}
                        />
                    )}
                </div>
            )}


            {/* ---------------------------------------- */}
            {/* FREELANCER ACTIONS */}
            {/* ---------------------------------------- */}

            {user?.role === "freelancer" &&
                project.client?._id !== user.id &&
                project.status === "open" &&
                !project.freelancer && (
                    <div>
                        <h3>Apply for this project</h3>

                        {!proposalProjectId ? (
                            <button
                                type="button"
                                onClick={() => setProposalProjectId(project._id)}
                            >
                                Apply
                            </button>
                        ) : (
                            <ProposalForm
                                project={project}
                                bidAmount={bidAmount}
                                coverLetter={coverLetter}
                                submittingProposal={submittingProposal}
                                setBidAmount={setBidAmount}
                                setCoverLetter={setCoverLetter}
                                handleSubmitProposal={handleSubmitProposal}
                                handleCancelProposal={() => {
                                    setProposalProjectId(null);
                                    setBidAmount("");
                                    setCoverLetter("");
                                }}
                            />
                        )}
                    </div>
                )}


            {/* ---------------------------------------- */}
            {/* PROPOSALS LIST (toggle) */}
            {/* ---------------------------------------- */}

            <ProjectProposals
                viewingProposals={viewingProposals}
                loadingProposals={loadingProposals}
                proposals={proposals}
                handleProposalStatus={handleProposalStatus}
                onClose={() => {
                    setViewingProposals(false);
                    setProposals([]);
                }}
            />


            {/* ---------------------------------------- */}
            {/* REVIEWS */}
            {/* ---------------------------------------- */}

            {project.status === "completed" && (
                <div>
                    <h2>Reviews</h2>

                    <RatingSummary
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                    />

                    <ReviewList
                        reviews={reviews}
                        loading={loadingReviews}
                    />

                    {(user?.id === project.client?._id ||
                        user?.id === project.freelancer?._id) &&
                        !showReviewForm && (
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(true)}
                            >
                                Leave Review
                            </button>
                        )}

                    {showReviewForm && (
                        <ReviewForm
                            projectId={projectId}
                            onReviewCreated={handleReviewCreated}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    )}
                </div>
            )}

        </div>
    );
}

export default ProjectDetails;