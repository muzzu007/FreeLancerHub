function RoleSelection({ onSelectRole }) {
  return (
    <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Join FreelanceHub</h1>
      <p style={{ marginBottom: "32px" }}>Choose how you want to use the platform</p>

      <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
        {/* Client Card */}
        <div
          onClick={() => onSelectRole("client")}
          style={{
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "32px 24px",
            width: "220px",
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#007bff";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,123,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ccc";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💼</div>
          <h3 style={{ margin: "0 0 8px 0" }}>I'm a Client</h3>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Post projects and hire freelancers
          </p>
        </div>

        {/* Freelancer Card */}
        <div
          onClick={() => onSelectRole("freelancer")}
          style={{
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "32px 24px",
            width: "220px",
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#28a745";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(40,167,69,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ccc";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>👨‍💻</div>
          <h3 style={{ margin: "0 0 8px 0" }}>I'm a Freelancer</h3>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Find projects and earn money
          </p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <p style={{ color: "#666" }}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default RoleSelection;