import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Navbar() {

    const { user, setUser } = useAuth();
    const navigate = useNavigate();


    const handleLogout = async () => {

        try {

            const response = await fetch(
                `${API_URL}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                console.error(
                    "Logout request failed"
                );
            }

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        } finally {

            setUser(null);
            navigate("/login");

        }
    };


    return (
        <nav>

            <div>

                <Link to="/">
                    <h2>FreelanceHub</h2>
                </Link>

            </div>


            {user && (
                <div>

                    <span>
                        Welcome, {user.name}
                    </span>


                    <Link to="/">
                        Dashboard
                    </Link>


                    <Link to="/projects">
                        Projects
                    </Link>


                    {user.role === "freelancer" && (
                        <Link to="/my-proposals">
                            My Proposals
                        </Link>
                    )}

                    {/* ✅ Admin link */}
                    {user.role === "admin" && (
                        <Link to="/admin/users">Admin Panel</Link>
                    )}

                    <Link to="/profile">
                        Profile
                    </Link>


                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
}

export default Navbar;