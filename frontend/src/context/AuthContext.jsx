import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import apiRequest from "../services/apiRequest";

const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const refreshUser = async () => {

        try {

            const response = await apiRequest("/auth/me");

            if (!response.ok) {
                setUser(null);
                return null;
            }

            const data = await response.json();

            setUser(data.user);

            return data.user;

        } catch (error) {

            console.error("Auth check failed:", error);

            setUser(null);

            return null;
        }
    };

    useEffect(() => {

        const initializeAuth = async () => {

            await refreshUser();

            setLoading(false);

        };

        initializeAuth();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export {
    AuthProvider,
    useAuth
};