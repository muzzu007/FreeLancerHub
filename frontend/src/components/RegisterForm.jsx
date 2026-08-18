import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/apiRequest";

function RegisterForm({ role, onBack }) {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      alert("Registration successful! Please complete your profile.");

      // Pass the user's name and role to the onboarding page
      navigate("/onboarding", {
        state: { role, name: name.trim() }
      });

    } catch (error) {
      console.error(error);
      alert("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const isClient = role === "client";

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <button
        type="button"
        onClick={onBack}
        style={{ marginBottom: "16px", cursor: "pointer" }}
      >
        ← Back
      </button>

      <h2>
        {isClient ? "Register as a Client" : "Register as a Freelancer"}
      </h2>

      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: "8px" }}
          />
          <small style={{ color: "#666" }}>Minimum 6 characters</small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            backgroundColor: isClient ? "#007bff" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;