import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Navbar() {

    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            await fetch(
                `${API_URL}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (error) {

            console.error("Logout error:", error);

        } finally {

            setUser(null);
            navigate("/login");

        }
    };

    return (
        <nav>

            <h2>FreelanceHub</h2>

            {user && (
                <p>
                    Welcome, {user.name}
                </p>
            )}

            <div>

                <Link to="/">
                    Home
                </Link>

                <Link to="/projects">
                    Projects
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;