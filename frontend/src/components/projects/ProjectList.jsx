import ProjectCard from "./ProjectCard";

function ProjectList({
    projects,
    user,
    setProposalProjectId
}) {

    return (
        <div>

            {projects.length === 0 ? (

                <p>
                    No projects found.
                </p>

            ) : (

                projects.map((project) => (

                    <ProjectCard
                        key={project._id}
                        project={project}
                        user={user}
                        setProposalProjectId={
                            setProposalProjectId
                        }
                    />

                ))

            )}

        </div>
    );
}

export default ProjectList;