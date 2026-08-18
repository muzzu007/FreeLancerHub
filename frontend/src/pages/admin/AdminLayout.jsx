import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLayout() {

    const { user } = useAuth();

    return (
        <div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <h2>Admin Panel</h2>
                <span>Welcome, {user?.name}</span>
            </div>

            <nav style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>
                <NavLink to="/admin/users" style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                    Users
                </NavLink>
                <NavLink to="/admin/projects" style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                    Projects
                </NavLink>
                <NavLink to="/admin/proposals" style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                    Proposals
                </NavLink>
                <NavLink to="/admin/reviews" style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                    Reviews
                </NavLink>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;