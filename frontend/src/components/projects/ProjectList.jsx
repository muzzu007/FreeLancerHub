import ProjectCard from "./ProjectCard";

function ProjectList({
    projects,
    user,
    handleUpdateProject,
    handleDeleteProject,
    setProposalProjectId,
    handleViewProposals,
    setReviewProjectId,
    reviewedProjects
}) {
    return (
        <div>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                projects.map((project) => (
                    <ProjectCard
                        key={project._id}
                        project={project}
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
                ))
            )}

        </div>
    );
}

export default ProjectList;