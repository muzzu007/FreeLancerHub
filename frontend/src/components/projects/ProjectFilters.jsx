function ProjectFilters({
    search,
    minBudget,
    maxBudget,
    status,
    sort,
    limit,
    setSearch,
    setMinBudget,
    setMaxBudget,
    setStatus,
    setSort,
    setLimit,
    handleApplyFilters,
    handleClearFilters
}) {
    return (
        <div>

            <h2>Find Projects</h2>

            <div>
                <label>Search</label>

                <input
                    type="text"
                    value={search}
                    placeholder="Search projects..."
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Minimum Budget</label>

                <input
                    type="number"
                    min="0"
                    value={minBudget}
                    onChange={(event) =>
                        setMinBudget(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Maximum Budget</label>

                <input
                    type="number"
                    min="0"
                    value={maxBudget}
                    onChange={(event) =>
                        setMaxBudget(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Status</label>

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option value="">All statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">
                        In Progress
                    </option>
                    <option value="completed">
                        Completed
                    </option>
                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>
            </div>

            <div>
                <label>Sort</label>

                <select
                    value={sort}
                    onChange={(event) =>
                        setSort(event.target.value)
                    }
                >
                    <option value="-createdAt">
                        Newest
                    </option>

                    <option value="createdAt">
                        Oldest
                    </option>

                    <option value="budget">
                        Budget: Low to High
                    </option>

                    <option value="-budget">
                        Budget: High to Low
                    </option>

                    <option value="title">
                        Title: A-Z
                    </option>

                    <option value="-title">
                        Title: Z-A
                    </option>
                </select>
            </div>

            <div>
                <label>Projects per page</label>

                <select
                    value={limit}
                    onChange={(event) =>
                        setLimit(Number(event.target.value))
                    }
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <button
                type="button"
                onClick={handleApplyFilters}
            >
                Search
            </button>

            <button
                type="button"
                onClick={handleClearFilters}
            >
                Clear
            </button>

        </div>
    );
}

export default ProjectFilters;