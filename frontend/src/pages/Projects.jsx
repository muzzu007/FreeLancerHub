import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import ReviewForm from "../components/reviews/ReviewForm";
import MyProposals from "../components/projects/MyProposals";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectList from "../components/projects/ProjectList";
import ProposalForm from "../components/projects/ProposalForm";
import ProposalList from "../components/projects/ProposalList";
import ProjectFilters from "../components/projects/ProjectFilters";
import {getProjectReviews} from "../services/reviewService";

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} from "../services/projectService";

import {
    submitProposal,
    getProjectProposals,
    updateProposalStatus
} from "../services/proposalService";


function Projects() {

    const { user } = useAuth();

    // Projects
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewProjectId, setReviewProjectId] = useState(null);
    const [reviewedProjects, setReviewedProjects] = useState([]);
    // Project form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Proposal form
    const [proposalProjectId, setProposalProjectId] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [submittingProposal, setSubmittingProposal] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("-createdAt");
    const [limit, setLimit] = useState(10);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);

    // Proposals
    const [viewingProposalsId, setViewingProposalsId] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(false);


    // Load projects
    const loadProjects = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            const response = await getProjects({
                search,
                minBudget,
                maxBudget,
                status,
                sort,
                page,
                limit
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to load projects"
                );
                return;
            }

            setProjects(data.projects);
            const reviewedProjectIds = [];

            for (const project of data.projects) {

                try {

                    const reviewResponse =
                        await getProjectReviews(project._id);

                    if (!reviewResponse.ok) {
                        continue;
                    }

                    const reviewData =
                        await reviewResponse.json();

                    const hasReviewed = reviewData.reviews?.some(
                        (review) =>
                            review.reviewer?._id === user?.id
                    );

                    if (hasReviewed) {
                        reviewedProjectIds.push(project._id);
                    }

                } catch (error) {

                    console.error(
                        "Unable to check project review:",
                        error
                    );

                }
            }

            setReviewedProjects(reviewedProjectIds);

            setCurrentPage(
                data.pagination.currentPage
            );

            setTotalPages(
                data.pagination.totalPages
            );

            setTotalProjects(
                data.pagination.totalProjects
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


    // Initial project load
    useEffect(() => {

        loadProjects(1);

    }, []);


    // Apply filters
    const handleApplyFilters = () => {

        loadProjects(1);

    };


    // Clear filters
    const handleClearFilters = async () => {

        setSearch("");
        setMinBudget("");
        setMaxBudget("");
        setStatus("");
        setSort("-createdAt");
        setLimit(10);

        try {

            setLoading(true);
            setError("");

            const response = await getProjects({
                search: "",
                minBudget: "",
                maxBudget: "",
                status: "",
                sort: "-createdAt",
                page: 1,
                limit: 10
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to load projects"
                );
                return;
            }

            setProjects(data.projects);

            setCurrentPage(
                data.pagination.currentPage
            );

            setTotalPages(
                data.pagination.totalPages
            );

            setTotalProjects(
                data.pagination.totalProjects
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


    // Create project
    const handleCreateProject = async (event) => {

        event.preventDefault();

        setCreating(true);

        try {

            const response = await createProject({
                title,
                description,
                budget
            });

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to create project"
                );
                return;
            }

            setProjects((previousProjects) => [
                data.project,
                ...previousProjects
            ]);

            setTitle("");
            setDescription("");
            setBudget("");

            alert(
                "Project created successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        } finally {

            setCreating(false);

        }
    };


    // Delete project
    const handleDeleteProject = async (projectId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await deleteProject(projectId);

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to delete project"
                );
                return;
            }

            setProjects((previousProjects) =>
                previousProjects.filter(
                    (project) =>
                        project._id !== projectId
                )
            );

            if (editingId === projectId) {

                setEditingId(null);
                setTitle("");
                setDescription("");
                setBudget("");

            }

            alert(
                "Project deleted successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        }
    };


    // Update project
    const handleUpdateProject = async (event) => {

        event.preventDefault();

        try {

            const response =
                await updateProject(
                    editingId,
                    {
                        title,
                        description,
                        budget
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to update project"
                );
                return;
            }

            setProjects((previousProjects) =>
                previousProjects.map(
                    (project) =>
                        project._id === editingId
                            ? data.project
                            : project
                )
            );

            setEditingId(null);

            setTitle("");
            setDescription("");
            setBudget("");

            alert(
                "Project updated successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        }
    };


    // Submit proposal
    const handleSubmitProposal = async (event) => {

        event.preventDefault();

        try {

            setSubmittingProposal(true);

            const response =
                await submitProposal({
                    project: proposalProjectId,
                    bidAmount,
                    coverLetter
                });

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to submit proposal"
                );
                return;
            }

            alert(
                "Proposal submitted successfully"
            );

            setProposalProjectId(null);
            setBidAmount("");
            setCoverLetter("");

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        } finally {

            setSubmittingProposal(false);

        }
    };


    // View project proposals
    const handleViewProposals = async (projectId) => {

        try {

            setLoadingProposals(true);
            setViewingProposalsId(projectId);

            const response =
                await getProjectProposals(projectId);

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to load proposals"
                );
                return;
            }

            setProposals(
                data.proposals
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        } finally {

            setLoadingProposals(false);

        }
    };


    // Accept / reject proposal
    const handleProposalStatus = async (
        proposalId,
        status
    ) => {

        try {

            const response =
                await updateProposalStatus(
                    proposalId,
                    status
                );

            const data =
                await response.json();

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

            alert(
                "Unable to reach server"
            );

        }
    };


    if (loading) {
        return <p>Loading projects...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>



            {/* Project creation / editing */}
            {user?.role === "client" && (

                <ProjectForm
                    editingId={editingId}
                    title={title}
                    description={description}
                    budget={budget}
                    creating={creating}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    setBudget={setBudget}
                    handleCreateProject={
                        handleCreateProject
                    }
                    handleUpdateProject={
                        handleUpdateProject
                    }
                    handleCancelEdit={() => {

                        setEditingId(null);
                        setTitle("");
                        setDescription("");
                        setBudget("");

                    }}
                />

            )}


            <h1>Projects</h1>
            {user?.role === "freelancer" && (
                <MyProposals />
            )}


            {/* Filters */}
            <ProjectFilters
                search={search}
                minBudget={minBudget}
                maxBudget={maxBudget}
                status={status}
                sort={sort}
                limit={limit}
                setSearch={setSearch}
                setMinBudget={setMinBudget}
                setMaxBudget={setMaxBudget}
                setStatus={setStatus}
                setSort={setSort}
                setLimit={setLimit}
                handleApplyFilters={
                    handleApplyFilters
                }
                handleClearFilters={
                    handleClearFilters
                }
            />



            {/* Projects */}
            {projects.length === 0 ? (

                <p>No projects found.</p>

            ) : (

                <ProjectList
                    projects={projects}
                    user={user}
                    handleUpdateProject={
                        handleUpdateProject
                    }
                    handleDeleteProject={
                        handleDeleteProject
                    }
                    setProposalProjectId={
                        setProposalProjectId
                    }
                    handleViewProposals={
                        handleViewProposals
                    }
                    setReviewProjectId={setReviewProjectId}
                    reviewedProjects={reviewedProjects}
                />

            )}


            {/* Pagination */}
            {totalProjects > 0 && (

                <div>

                    <p>
                        Page {currentPage} of{" "}
                        {totalPages}
                        {" "}({totalProjects} projects)
                    </p>

                    <button
                        type="button"
                        disabled={
                            currentPage <= 1 ||
                            loading
                        }
                        onClick={() =>
                            loadProjects(
                                currentPage - 1
                            )
                        }
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        disabled={
                            currentPage >= totalPages ||
                            loading
                        }
                        onClick={() =>
                            loadProjects(
                                currentPage + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>

            )}


            {/* Proposals */}
            {viewingProposalsId && (

                <div>

                    {loadingProposals ? (

                        <p>
                            Loading proposals...
                        </p>

                    ) : (

                        <ProposalList
                            proposals={proposals}
                            handleProposalStatus={
                                handleProposalStatus
                            }
                        />

                    )}

                    <button
                        type="button"
                        onClick={() => {

                            setViewingProposalsId(null);
                            setProposals([]);

                        }}
                    >
                        Close Proposals
                    </button>

                </div>

            )}


            {/* Proposal submission */}
            <ProposalForm
                proposalProjectId={
                    proposalProjectId
                }
                projects={projects}
                bidAmount={bidAmount}
                coverLetter={coverLetter}
                submittingProposal={
                    submittingProposal
                }
                setBidAmount={setBidAmount}
                setCoverLetter={setCoverLetter}
                handleSubmitProposal={
                    handleSubmitProposal
                }
                handleCancelProposal={() => {

                    setProposalProjectId(null);
                    setBidAmount("");
                    setCoverLetter("");

                }}

            />
            {reviewProjectId && (
                <ReviewForm
                    projectId={reviewProjectId}
                    onReviewCreated={() => {

                        setReviewedProjects(
                            (previousProjects) => [
                                ...previousProjects,
                                reviewProjectId
                            ]
                        );

                        setReviewProjectId(null);
                    }}
                    onCancel={() => {
                        setReviewProjectId(null);
                    }}
                />
            )}

        </div>
    );
}

export default Projects;