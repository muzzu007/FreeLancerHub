function ProjectForm({
    editingId,
    title,
    description,
    budget,
    creating,
    setTitle,
    setDescription,
    setBudget,
    handleCreateProject,
    handleUpdateProject,
    handleCancelEdit
}) {
    const handleSubmit = editingId
        ? handleUpdateProject
        : handleCreateProject;

    return (
        <form onSubmit={handleSubmit}>

            <h2>
                {editingId
                    ? "Edit Project"
                    : "Create Project"}
            </h2>

            <div>
                <label>Title</label>

                <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Description</label>

                <textarea
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Budget</label>

                <input
                    type="number"
                    value={budget}
                    onChange={(event) =>
                        setBudget(event.target.value)
                    }
                />
            </div>

            <button
                type="submit"
                disabled={creating}
            >
                {creating
                    ? editingId
                        ? "Updating..."
                        : "Creating..."
                    : editingId
                        ? "Update Project"
                        : "Create Project"}
            </button>

            {editingId && (
                <button
                    type="button"
                    onClick={handleCancelEdit}
                >
                    Cancel
                </button>
            )}

        </form>
    );
}

export default ProjectForm;