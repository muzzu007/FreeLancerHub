import { Link } from "react-router-dom";

function ProjectCard({
    project,
    user,
    setProposalProjectId
}) {

    return (
        <div>

            <h2>
                {project.title}
            </h2>


            <p>
                {project.description}
            </p>


            <p>
                Budget: ₹{project.budget}
            </p>


            <p>
                Client:{" "}
                {project.client?.name ||
                    "Unknown"}
            </p>


            <p>
                Freelancer:{" "}
                {project.freelancer?.name ||
                    "Not hired"}
            </p>


            <p>
                Status: {project.status}
            </p>


            <Link
                to={`/projects/${project._id}`}
            >
                View Details
            </Link>


            {user?.role === "freelancer" &&
                project.client?._id !== user.id &&
                project.status === "open" &&
                !project.freelancer && (

                    <button
                        type="button"
                        onClick={() =>
                            setProposalProjectId(
                                project._id
                            )
                        }
                    >
                        Apply
                    </button>

                )}


            <hr />

        </div>
    );
}

export default ProjectCard;