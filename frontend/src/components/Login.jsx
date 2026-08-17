import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/apiRequest";
import { useNavigate } from "react-router-dom";

function Login() {

    const { setUser } = useAuth()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email.trim() || !password) {
            alert("Please enter your email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log(data);
            if (!response.ok) {
                alert(data.message);
                return;
            }
            console.log("Login response:", data);
            console.log("User:", data.user);
            setUser(data.user)

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <h1>FreelanceHub</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}

export default Login;