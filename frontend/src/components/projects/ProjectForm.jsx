import SkillsSelect from "../common/SkillsSelect";
import { PlusCircle, Loader2 } from "lucide-react";

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <PlusCircle size={20} className="text-[#635bff]" />
                Create Project
            </h2>

            <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Title *
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        placeholder="Enter project title..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description *
                    </label>
                    <textarea
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        rows={4}
                        placeholder="Describe your project in detail..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Budget *
                    </label>
                    <input
                        type="number"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        min="1"
                        required
                        placeholder="Enter budget amount..."
                    />
                </div>

                <div>
                    <SkillsSelect
                        selectedSkills={skills}
                        onChange={setSkills}
                        label="Required Skills"
                    />
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {creating ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <PlusCircle size={18} />
                            Create Project
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default ProjectForm;