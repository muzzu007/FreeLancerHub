import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/apiRequest";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            alert("Please fill in all required fields");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {

            const response = await apiRequest(
                "/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful!");

            navigate("/login");

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

            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />
                </div>

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

                <div>
                    <label>Role</label>

                    <select
                        value={role}
                        onChange={(event) =>
                            setRole(event.target.value)
                        }
                    >
                        <option value="client">
                            Client
                        </option>

                        <option value="freelancer">
                            Freelancer
                        </option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Registering..."
                        : "Register"}
                </button>

            </form>

        </div>
    );
}

export default Register;