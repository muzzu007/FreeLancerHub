function EditProjectForm({
    title,
    description,
    budget,
    updating,
    setTitle,
    setDescription,
    setBudget,
    handleUpdateProject,
    handleCancelEdit
}) {
    return (
        <form onSubmit={handleUpdateProject}>
            <h3>Edit Project</h3>

            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div>
                <label>Budget</label>
                <input
                    type="number"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                />
            </div>

            <button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Save Changes"}
            </button>

            <button type="button" onClick={handleCancelEdit} disabled={updating}>
                Cancel
            </button>
        </form>
    );
}

export default EditProjectForm;