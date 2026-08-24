import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API_URL from "../services/api";
import { 
  LogOut, 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Shield, 
  User, 
  Home 
} from "lucide-react";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Logout request failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const linkClasses = "flex items-center gap-1.5 text-gray-600 hover:text-[#635bff] transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-50";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#635bff] to-[#00d4b2] bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </Link>

          {/* Right side */}
          {user && (
            <div className="flex items-center gap-1">
              {/* Welcome */}
              <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                Welcome, <span className="font-medium text-gray-700">{user.name}</span>
              </span>

              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link to="/" className={linkClasses}>
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/projects" className={linkClasses}>
                  <FolderOpen size={18} />
                  <span className="hidden sm:inline">Projects</span>
                </Link>
                {user.role === "freelancer" && (
                  <Link to="/my-proposals" className={linkClasses}>
                    <FileText size={18} />
                    <span className="hidden sm:inline">My Proposals</span>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin/users" className={linkClasses}>
                    <Shield size={18} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <Link to="/profile" className={linkClasses}>
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50 ml-1"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;