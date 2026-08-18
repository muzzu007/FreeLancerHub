import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/apiRequest";
import SkillsSelect from "../components/common/SkillsSelect";

function Onboarding() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  // Get role from navigation state, or fallback to user context
  const role = location.state?.role || user?.role;

  // ✅ Make the name editable – store it in state
  const [displayName, setDisplayName] = useState(
    location.state?.name || user?.name || ""
  );

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);

  const isFreelancer = role === "freelancer";
  const isClient = role === "client";

  // If no role is available, redirect to register
  useEffect(() => {
    if (!role) {
      navigate("/register");
    }
  }, [role, navigate]);

  const handleComplete = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const updateData = {
        name: displayName.trim(),  // ✅ Save the updated name
        bio: bio.trim()
      };

      if (isFreelancer) {
        updateData.skills = skills;
      }

      // ❌ No 'company' field – we just keep it as 'name'

      const response = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update profile");
        return;
      }

      await refreshUser();

      alert("Profile completed! Welcome to FreelanceHub.");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    try {
      await refreshUser();
      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setSkipping(false);
    }
  };

  if (!role) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Complete Your Profile</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        {isClient
          ? "Tell freelancers about your company and what you're looking for."
          : "Tell clients about your skills and expertise."}
      </p>

      <form onSubmit={handleComplete}>
        {/* ✅ Editable Full Name / Company Name */}
        <div>
          <label>Full Name / Company Name *</label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <small style={{ color: "#666" }}>
            This is the name that will be shown to other users.
          </small>
        </div>

        {/* Bio for both */}
        <div style={{ marginTop: "16px" }}>
          <label>Bio (optional)</label>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder={isClient
              ? "Tell freelancers about your company and the type of projects you post..."
              : "Tell clients about your experience, expertise, and what you specialize in..."
            }
            rows={4}
            maxLength={500}
            style={{ width: "100%", padding: "8px" }}
          />
          <small style={{ color: "#666" }}>
            {bio.length}/500 characters
          </small>
        </div>

        {/* Skills (Freelancer only) */}
        {isFreelancer && (
          <div style={{ marginTop: "16px" }}>
            <SkillsSelect
              selectedSkills={skills}
              onChange={setSkills}
              label="Your Skills (optional)"
            />
          </div>
        )}

        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={skipping}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            {skipping ? "Redirecting..." : "Skip for now"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Onboarding;