import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import ProjectForm from "../components/projects/ProjectForm";
import ProjectList from "../components/projects/ProjectList";
import ProposalForm from "../components/projects/ProposalForm";
import ProjectFilters from "../components/projects/ProjectFilters";


import {
    getProjects,
    createProject
} from "../services/projectService";

import {
    submitProposal
} from "../services/proposalService";


function Projects() {

    const { user } = useAuth();


    // --------------------------------------------------
    // PROJECTS
    // --------------------------------------------------

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // --------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [budget, setBudget] =
        useState("");
    const [skills, setSkills] = useState([]);

    const [creating, setCreating] =
        useState(false);


    // --------------------------------------------------
    // PROPOSAL
    // --------------------------------------------------

    const [proposalProjectId, setProposalProjectId] =
        useState(null);

    const [bidAmount, setBidAmount] =
        useState("");

    const [coverLetter, setCoverLetter] =
        useState("");

    const [submittingProposal, setSubmittingProposal] =
        useState(false);


    // --------------------------------------------------
    // FILTERS
    // --------------------------------------------------

    const [search, setSearch] =
        useState("");

    const [minBudget, setMinBudget] =
        useState("");

    const [maxBudget, setMaxBudget] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [sort, setSort] =
        useState("-createdAt");

    const [limit, setLimit] =
        useState(10);


    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalProjects, setTotalProjects] =
        useState(0);


    // --------------------------------------------------
    // LOAD PROJECTS
    // --------------------------------------------------

    const loadProjects = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getProjects({
                    search,
                    minBudget,
                    maxBudget,
                    status,
                    sort,
                    page,
                    limit
                });

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to load projects"
                );

                return;
            }

            setProjects(
                data.projects
            );

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


    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {

        loadProjects(1);

    }, []);


    // --------------------------------------------------
    // APPLY FILTERS
    // --------------------------------------------------

    const handleApplyFilters = () => {

        loadProjects(1);

    };


    // --------------------------------------------------
    // CLEAR FILTERS
    // --------------------------------------------------

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

            const response =
                await getProjects({
                    search: "",
                    minBudget: "",
                    maxBudget: "",
                    status: "",
                    sort: "-createdAt",
                    page: 1,
                    limit: 10
                });

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to load projects"
                );

                return;
            }

            setProjects(
                data.projects
            );

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


    // --------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------

    const handleCreateProject =
        async (event) => {

            event.preventDefault();

            setCreating(true);

            try {

                const response =
                    await createProject({
                        title,
                        description,
                        budget,
                        skills
                    });

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to create project"
                    );

                    return;
                }

                setProjects(
                    (previousProjects) => [
                        data.project,
                        ...previousProjects
                    ]
                );

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


    // --------------------------------------------------
    // SUBMIT PROPOSAL
    // --------------------------------------------------

    const handleSubmitProposal =
        async (event) => {

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


    // --------------------------------------------------
    // LOADING / ERROR
    // --------------------------------------------------

    if (loading) {

        return (
            <p>
                Loading projects...
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


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div>

            {/* ---------------------------------------- */}
            {/* CREATE PROJECT */}
            {/* ---------------------------------------- */}

            {user?.role === "client" && (

                <ProjectForm
                    title={title}
                    description={description}
                    budget={budget}
                    skills={skills} 
                    creating={creating}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    setBudget={setBudget}
                    setSkills={setSkills}
                    handleCreateProject={handleCreateProject}
                />

            )}


            <h1>
                Projects
            </h1>


          

            {/* ---------------------------------------- */}
            {/* FILTERS */}
            {/* ---------------------------------------- */}

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


            {/* ---------------------------------------- */}
            {/* PROJECT LIST */}
            {/* ---------------------------------------- */}

            {projects.length === 0 ? (

                <p>
                    No projects found.
                </p>

            ) : (

                <ProjectList
                    projects={projects}
                    user={user}
                    setProposalProjectId={
                        setProposalProjectId
                    }
                />

            )}


            {/* ---------------------------------------- */}
            {/* PAGINATION */}
            {/* ---------------------------------------- */}

            {totalProjects > 0 && (

                <div>

                    <p>
                        Page {currentPage} of{" "}
                        {totalPages}
                        {" "}
                        ({totalProjects} projects)
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



            {/* ---------------------------------------- */}
            {/* PROPOSAL FORM (inline) */}
            {/* ---------------------------------------- */}

            {proposalProjectId && (
                <ProposalForm
                    project={projects.find(p => p._id === proposalProjectId)}  // ✅ find the project
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
    );
}


export default Projects;