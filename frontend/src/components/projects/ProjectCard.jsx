function ProjectCard({
    project,
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

            <h2>{project.title}</h2>

            <p>{project.description}</p>

            <p>
                Budget: ₹{project.budget}
            </p>

            <p>
                Client: {project.client?.name}
            </p>

            <p>
                Freelancer:{" "}
                {project.freelancer
                    ? "Hired"
                    : "Not hired"}
            </p>

            <p>
                Status: {project.status}
            </p>

            {user?.role === "client" &&
                project.client?._id === user.id && (
                    <>
                        <button
                            onClick={() =>
                                handleUpdateProject(project)
                            }
                        >
                            Edit
                        </button>

                        {!project.freelancer && (
                            <button
                                onClick={() =>
                                    handleDeleteProject(project._id)
                                }
                            >
                                Delete
                            </button>
                        )}

                        <button
                            onClick={() =>
                                handleViewProposals(project._id)
                            }
                        >
                            View Proposals
                        </button>
                    </>
                )}

            {user?.role === "freelancer" &&
                project.client?._id !== user.id &&
                project.status === "open" &&
                !project.freelancer && (
                    <button
                        onClick={() =>
                            setProposalProjectId(project._id)
                        }
                    >
                        Apply
                    </button>
                )}

            {project.status === "completed" &&
                !reviewedProjects.includes(project._id) &&
                (
                    project.client?._id === user?.id ||
                    project.freelancer?._id === user?.id ||
                    project.freelancer === user?.id
                ) && (
                    <button
                        type="button"
                        onClick={() =>
                            setReviewProjectId(project._id)
                        }
                    >
                        Leave Review
                    </button>
                )}
            <hr />

        </div>
    );
}

export default ProjectCard;