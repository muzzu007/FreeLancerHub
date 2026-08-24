import ProjectCard from "./ProjectCard";
import { FolderOpen } from "lucide-react";

function ProjectList({
    projects,
    user,
    setProposalProjectId
}) {
    if (projects.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No projects found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project._id}
                    project={project}
                    user={user}
                    setProposalProjectId={setProposalProjectId}
                />
            ))}
        </div>
    );
}

export default ProjectList;