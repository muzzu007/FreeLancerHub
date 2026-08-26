import { X } from "lucide-react";

function ProjectFilters({
    minBudget,
    maxBudget,
    status,
    sort,
    limit,
    setMinBudget,
    setMaxBudget,
    setStatus,
    setSort,
    setLimit,
    handleApplyFilters,
    handleClearFilters
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Min Budget */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Min Budget
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={minBudget}
                        placeholder="Min"
                        onChange={(event) => setMinBudget(event.target.value)}
                    />
                </div>

                {/* Max Budget */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Max Budget
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                        value={maxBudget}
                        placeholder="Max"
                        onChange={(event) => setMaxBudget(event.target.value)}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Status
                    </label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Sort
                    </label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                    >
                        <option value="-createdAt">Newest</option>
                        <option value="createdAt">Oldest</option>
                        <option value="budget">Budget: Low to High</option>
                        <option value="-budget">Budget: High to Low</option>
                        <option value="title">Title: A-Z</option>
                        <option value="-title">Title: Z-A</option>
                    </select>
                </div>

                {/* Limit */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Per Page
                    </label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
                        value={limit}
                        onChange={(event) => setLimit(Number(event.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-800 transition-colors duration-200"
                >
                    Apply Filters
                </button>
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                    <X size={18} />
                    Clear All
                </button>
            </div>
        </div>
    );
}

export default ProjectFilters;