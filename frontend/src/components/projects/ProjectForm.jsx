import SkillsSelect from "../common/SkillsSelect";

function ProjectForm({
    title,
    description,
    budget,
    skills = [],
    creating,
    setTitle,
    setDescription,
    setBudget,
    setSkills,
    handleCreateProject
}) {

    return (
        <form onSubmit={handleCreateProject}>

            <h2>
                Create Project
            </h2>


            <div>

                <label>
                    Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    required
                />

            </div>


            <div>

                <label>
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    required
                />

            </div>


            <div>

                <label>
                    Budget
                </label>

                <input
                    type="number"
                    value={budget}
                    onChange={(event) =>
                        setBudget(event.target.value)
                    }
                    min="1"
                    required
                />

                {/* ✅ Skills section */}
                <SkillsSelect
                    selectedSkills={skills}
                    onChange={setSkills}
                    label="Required Skills"
                />

            </div>


            <button
                type="submit"
                disabled={creating}
            >
                {creating
                    ? "Creating..."
                    : "Create Project"}
            </button>

        </form>
    );
}

export default ProjectForm;