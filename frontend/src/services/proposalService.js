import apiRequest from "./apiRequest";


export const submitProposal = (proposalData) => {
    return apiRequest("/proposals", {
        method: "POST",
        body: JSON.stringify(proposalData)
    });
};


export const getProjectProposals = (projectId) => {
    return apiRequest(
        `/proposals/project/${projectId}`
    );
};


export const getMyProposals = () => {
    return apiRequest("/proposals/my");
};


export const updateProposalStatus = (
    proposalId,
    status
) => {
    return apiRequest(
        `/proposals/${proposalId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({ status })
        }
    );
};

export const withdrawProposal = (proposalId) => {
    return apiRequest(
        `/proposals/${proposalId}/withdraw`,
        {
            method: "PATCH"
        }
    );
};