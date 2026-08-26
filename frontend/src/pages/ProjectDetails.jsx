import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import {
    getProject,
    updateProject,
    deleteProject,
    updateProjectStatus
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
import EditProjectForm from "../components/projects/EditProjectForm";
import ProjectProposals from "../components/projects/ProjectProposals";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Eye,
    Briefcase,
    User,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Send,
    Star
} from "lucide-react";
import useConfirm from "../hooks/useConfirm";


function ProjectDetails() {

    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [updating, setUpdating] = useState(false);

    const [proposalProjectId, setProposalProjectId] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [submittingProposal, setSubmittingProposal] = useState(false);

    const [proposals, setProposals] = useState([]);
    const [viewingProposals, setViewingProposals] = useState(false);
    const [loadingProposals, setLoadingProposals] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { confirm, ModalComponent } = useConfirm();

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

    const isProjectOwner =
        user?.role === "client" &&
        project?.client?._id === user?.id;

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

                toast.error(
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

            toast.success("Project updated successfully");

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");

        } finally {

            setUpdating(false);

        }
    };

    // --------------------------------------------------
    // COMPLETE PROJECT (in-progress → completed)
    // --------------------------------------------------

    const handleCompleteProject = async () => {
        const confirmed = await confirm({
            title: "Complete Project",
            message: "Are you sure you want to mark this project as completed?",
            confirmText: "Yes, Complete",
            confirmVariant: "success",
        });

        if (!confirmed) return;
        

        try {
            const response = await updateProjectStatus(projectId, "completed");
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to complete project");
                return;
            }

            setProject(data.project);
            toast.success("Project marked as completed! 🎉");

        } catch (error) {
            console.error(error);
            toast.error("Unable to reach server");
        }
    };

    const handleDeleteProject = async () => {
        const confirmed = await confirm({
            title: "Delete Project",
            message: "Are you sure you want to delete this project? This action cannot be undone.",
            confirmText: "Delete",
            confirmVariant: "danger",
        });

        if (!confirmed) return;

        try {
            const response = await deleteProject(projectId);
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to delete project");
                return;
            }

            toast.success("Project deleted successfully");
            navigate("/projects");
        } catch (error) {
            console.error(error);
            toast.error("Unable to reach server");
        }
    };

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

                toast.error(
                    data.message ||
                    "Unable to submit proposal"
                );

                return;
            }

            toast.success("Proposal submitted successfully");

            setProposalProjectId(null);
            setBidAmount("");
            setCoverLetter("");

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");

        } finally {

            setSubmittingProposal(false);

        }
    };

    const handleViewProposals = async () => {

        try {

            setLoadingProposals(true);
            setViewingProposals(true);

            const response = await getProjectProposals(projectId);
            const data = await response.json();

            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Unable to load proposals"
                );

                return;
            }

            setProposals(data.proposals);

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");

        } finally {

            setLoadingProposals(false);

        }
    };

    const handleProposalStatus = async (proposalId, status) => {

        try {

            const response = await updateProposalStatus(proposalId, status);
            const data = await response.json();

            if (!response.ok) {

                toast.error(
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

            toast.success(
                status === "accepted"
                    ? "Proposal accepted"
                    : "Proposal rejected"
            );

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");
        }
    };

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

    const getStatusBadge = (status) => {
        const styles = {
            open: "bg-blue-100 text-blue-800",
            "in-progress": "bg-yellow-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!project) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                Project not found.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                type="button"
                onClick={() => navigate("/projects")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-4"
            >
                <ArrowLeft size={20} />
                Back to Projects
            </button>

            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <DollarSign size={16} />
                                Budget: ₹{project.budget}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={16} />
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                                    {project.status}
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={16} />
                                Client: {project.client?.name || "Unknown"}
                            </span>
                            {project.freelancer && (
                                <span className="flex items-center gap-1">
                                    <Briefcase size={16} />
                                    Freelancer: {project.freelancer?.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-gray-700">{project.description}</p>
                </div>
            </div>

            {/* Client Actions */}
            {isProjectOwner && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Management</h3>

                    {!editing ? (
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleStartEdit}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                            >
                                <Edit size={18} />
                                Edit
                            </button>

                            {!project.freelancer && (
                                <button
                                    type="button"
                                    onClick={handleDeleteProject}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleViewProposals}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600 transition-colors duration-200"
                            >
                                <Eye size={18} />
                                View Proposals
                            </button>
                            {project.status === "in-progress" && (
                                <button
                                    type="button"
                                    onClick={handleCompleteProject}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
                                >
                                    ✅ Mark as Completed
                                </button>
                            )}
                        </div>
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

            {/* Freelancer Actions */}
            {user?.role === "freelancer" &&
                project.client?._id !== user.id &&
                project.status === "open" &&
                !project.freelancer && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply for this project</h3>

                        {!proposalProjectId ? (
                            <button
                                type="button"
                                onClick={() => setProposalProjectId(project._id)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                            >
                                <Send size={18} />
                                Apply Now
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

            {/* Proposals List */}
            <ProjectProposals
                viewingProposals={viewingProposals}
                loadingProposals={loadingProposals}
                proposals={proposals}
                handleProposalStatus={handleProposalStatus}
                project={project}
                onClose={() => {
                    setViewingProposals(false);
                    setProposals([]);
                }}
            />

            {/* Reviews */}
            {project.status === "completed" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

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
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 mt-4"
                            >
                                <Star size={18} />
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
            {ModalComponent}
        </div>
    );
}

export default ProjectDetails;