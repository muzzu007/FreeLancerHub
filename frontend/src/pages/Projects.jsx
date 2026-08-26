import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import {
    getProjects,
    createProject,
    getRecommendedProjects
} from "../services/projectService";
import {
    submitProposal
} from "../services/proposalService";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectList from "../components/projects/ProjectList";
import ProposalForm from "../components/projects/ProposalForm";
import ProjectFilters from "../components/projects/ProjectFilters";
import { Briefcase, Sparkles, Plus, Filter, Search } from "lucide-react";

function Projects() {

    const { user } = useAuth();

    // --------------------------------------------------
    // PROJECTS
    // --------------------------------------------------

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [skills, setSkills] = useState([]);
    const [creating, setCreating] = useState(false);

    // --------------------------------------------------
    // PROPOSAL
    // --------------------------------------------------

    const [proposalProjectId, setProposalProjectId] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [submittingProposal, setSubmittingProposal] = useState(false);

    // --------------------------------------------------
    // FILTERS
    // --------------------------------------------------

    const [search, setSearch] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("-createdAt");
    const [limit, setLimit] = useState(10);
    const [viewMode, setViewMode] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);

    // --------------------------------------------------
    // LOAD PROJECTS
    // --------------------------------------------------

    const loadProjects = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            let response;

            if (viewMode === "recommended") {
                response = await getRecommendedProjects();
            } else {
                response = await getProjects({
                    search,
                    minBudget,
                    maxBudget,
                    status,
                    sort,
                    page,
                    limit
                });
            }

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to load projects");
                return;
            }

            if (viewMode === "recommended") {
                setProjects(data.projects || []);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalProjects(data.projects?.length || 0);
            } else {
                setProjects(data.projects);
                setCurrentPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
                setTotalProjects(data.pagination.totalProjects);
            }

        } catch (error) {

            console.error(error);
            setError("Unable to reach server");

        } finally {

            setLoading(false);

        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        loadProjects(1);
    }, [viewMode]);

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
                setError(data.message || "Unable to load projects");
                return;
            }

            setProjects(data.projects);
            setCurrentPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
            setTotalProjects(data.pagination.totalProjects);

        } catch (error) {

            console.error(error);
            setError("Unable to reach server");

        } finally {

            setLoading(false);

        }
    };

    // --------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------

    const handleCreateProject = async (event) => {

        event.preventDefault();
        setCreating(true);

        try {

            const response = await createProject({
                title,
                description,
                budget,
                skills
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to create project");
                return;
            }

            setProjects((previousProjects) => [
                data.project,
                ...previousProjects
            ]);

            setTitle("");
            setDescription("");
            setBudget("");
            setSkills([]);

            toast.success("Project created successfully!");

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");

        } finally {

            setCreating(false);

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
                toast.error(data.message || "Unable to submit proposal");
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

    // --------------------------------------------------
    // LOADING / ERROR
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading projects...</p>
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

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                    <p className="text-gray-500 mt-1">Browse and find your next opportunity</p>
                </div>

                {user?.role === "client" && (
                    <button
                        type="button"
                        onClick={() => document.getElementById("createProjectForm")?.scrollIntoView({ behavior: "smooth" })}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                    >
                        <Plus size={20} />
                        Post a Project
                    </button>
                )}
            </div>

            {/* View Mode Toggle - Freelancer only */}
            {user?.role === "freelancer" && (
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                    <button
                        type="button"
                        onClick={() => setViewMode("all")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            viewMode === "all"
                                ? "bg-white text-[#635bff] shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        <Briefcase size={18} />
                        All Projects
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("recommended")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            viewMode === "recommended"
                                ? "bg-white text-[#00d4b2] shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        <Sparkles size={18} />
                        Recommended for You
                    </button>
                </div>
            )}

            {/* ========================================== */}
            {/* SEARCH + FILTER TOGGLE */}
            {/* ========================================== */}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search Input */}
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects by title..."
                        onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                    />
                    <button
                        onClick={handleApplyFilters}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 whitespace-nowrap"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        showFilters
                            ? "bg-[#635bff] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Filter size={18} />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* ========================================== */}
            {/* FILTERS (Collapsible) */}
            {/* ========================================== */}

            {showFilters && (
                <div className="mb-6 animate-fadeIn">
                    <ProjectFilters
                        minBudget={minBudget}
                        maxBudget={maxBudget}
                        status={status}
                        sort={sort}
                        limit={limit}
                        setMinBudget={setMinBudget}
                        setMaxBudget={setMaxBudget}
                        setStatus={setStatus}
                        setSort={setSort}
                        setLimit={setLimit}
                        handleApplyFilters={handleApplyFilters}
                        handleClearFilters={handleClearFilters}
                    />
                </div>
            )}

            {/* Create Project Form - Client only */}
            {user?.role === "client" && (
                <div id="createProjectForm" className="mb-6">
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
                </div>
            )}

            {/* Project List */}
            {projects.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                    <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No projects found.</p>
                    {user?.role === "freelancer" && viewMode === "recommended" && (
                        <p className="text-sm text-gray-400 mt-2">
                            Try adding more skills to your profile for better recommendations.
                        </p>
                    )}
                </div>
            ) : (
                <ProjectList
                    projects={projects}
                    user={user}
                    setProposalProjectId={setProposalProjectId}
                />
            )}

            {/* Pagination - only for "all" mode */}
            {viewMode === "all" && totalProjects > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages} ({totalProjects} projects)
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={currentPage <= 1 || loading}
                            onClick={() => loadProjects(currentPage - 1)}
                            className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages || loading}
                            onClick={() => loadProjects(currentPage + 1)}
                            className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Proposal Form (inline when applying) */}
            {proposalProjectId && (
                <div className="mt-6">
                    <ProposalForm
                        project={projects.find(p => p._id === proposalProjectId)}
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
                </div>
            )}
        </div>
    );
}

export default Projects;