import apiRequest from "./apiRequest";

// =============================================
// USERS
// =============================================

export const getAdminUsers = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });
    const queryString = query.toString();
    return apiRequest(
        queryString ? `/admin/users?${queryString}` : "/admin/users"
    );
};

export const getUserById = (userId) => {
    return apiRequest(`/admin/users/${userId}`);
};

export const updateUserStatus = (userId, isActive) => {
    return apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive })
    });
};

export const updateUserRole = (userId, role) => {
    return apiRequest(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
    });
};

export const deleteUser = (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: "DELETE"
    });
};

// =============================================
// PROJECTS
// =============================================

export const getAdminProjects = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });
    const queryString = query.toString();
    return apiRequest(
        queryString ? `/admin/projects?${queryString}` : "/admin/projects"
    );
};

export const deleteProjectAsAdmin = (projectId) => {
    return apiRequest(`/admin/projects/${projectId}`, {
        method: "DELETE"
    });
};

// =============================================
// PROPOSALS
// =============================================

export const getAdminProposals = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });
    const queryString = query.toString();
    return apiRequest(
        queryString ? `/admin/proposals?${queryString}` : "/admin/proposals"
    );
};

export const deleteProposalAsAdmin = (proposalId) => {
    return apiRequest(`/admin/proposals/${proposalId}`, {
        method: "DELETE"
    });
};

// =============================================
// REVIEWS
// =============================================

export const getAdminReviews = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });
    const queryString = query.toString();
    return apiRequest(
        queryString ? `/admin/reviews?${queryString}` : "/admin/reviews"
    );
};

export const deleteReviewAsAdmin = (reviewId) => {
    return apiRequest(`/admin/reviews/${reviewId}`, {
        method: "DELETE"
    });
};