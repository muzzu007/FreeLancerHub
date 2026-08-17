import apiRequest from "./apiRequest";


export const createReview = (reviewData) => {
    return apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData)
    });
};


export const getProjectReviews = (projectId) => {
    return apiRequest(
        `/reviews/project/${projectId}`
    );
};


export const getUserReviews = (userId) => {
    return apiRequest(
        `/reviews/user/${userId}`
    );
};