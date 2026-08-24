import { Link, useNavigate } from "react-router-dom";
import { Eye, DollarSign, Briefcase, User, Zap } from "lucide-react";

function ProjectCard({ project, user }) {
    const navigate = useNavigate(); // ✅ Fixed: removed 'new'

    const handleApply = () => {
        navigate(`/projects/${project._id}`);
    };

    const getStatusBadge = (status) => {
        const styles = {
            open: "bg-blue-100 text-blue-700",
            "in-progress": "bg-yellow-100 text-yellow-700",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return styles[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-[#635bff] transition-colors">
                        <Link to={`/projects/${project._id}`}>{project.title}</Link>
                    </h2>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <DollarSign size={16} className="text-gray-400" />
                            Budget: ₹{project.budget}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                            {project.status}
                        </span>
                        {project.matchPercentage !== undefined && (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#635bff]">
                                <Zap size={14} />
                                Match: {project.matchPercentage}%
                            </span>
                        )}
                    </div>

                    {user?.role === "freelancer" &&
                        project.client?._id !== user.id &&
                        project.status === "open" &&
                        !project.freelancer && (
                            <span className="inline-block mt-3 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                ✓ Available for Apply
                            </span>
                        )}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to={`/projects/${project._id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                    >
                        <Eye size={18} />
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;