import API_URL from "./api";

async function apiRequest(endpoint, options = {}) {

    const makeRequest = () => {
        return fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                }
            }
        );
    };

    let response = await makeRequest();

    if (response.status === 401) {

        const refreshResponse = await fetch(
            `${API_URL}/auth/refresh`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        if (!refreshResponse.ok) {
            return response;
        }

        response = await makeRequest();
    }

    return response;
}

export default apiRequest;