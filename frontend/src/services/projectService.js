import apiRequest from "./apiRequest";

export const getProjects = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });


    
    
    const queryString = query.toString();
    
    return apiRequest(
        queryString
        ? `/projects?${queryString}`
        : "/projects"
    );
};

export const getProject = (projectId) => {
    return apiRequest(`/projects/${projectId}`);
};

export const createProject = (projectData) => {
    return apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(projectData)
    });
};


export const updateProject = (projectId, projectData) => {
    return apiRequest(`/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(projectData)
    });
};


export const updateProjectStatus = (projectId, status) => {
    return apiRequest(`/projects/${projectId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
    });
};


export const deleteProject = (projectId) => {
    return apiRequest(`/projects/${projectId}`, {
        method: "DELETE"
    });
};