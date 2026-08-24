import { Save, X } from "lucide-react";

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
        <form onSubmit={handleUpdateProject} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Edit Project</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                </label>
                <textarea
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Budget
                </label>
                <input
                    type="number"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    min="1"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <X size={18} />
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditProjectForm;