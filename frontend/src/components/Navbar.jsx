import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useConfirm } from "../hooks/useConfirm";
import { toast } from "react-hot-toast";
import API_URL from "../services/api";
import { 
  LogOut, LayoutDashboard, FolderOpen, FileText, 
  Shield, User, Menu, X 
} from "lucide-react";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { confirm, ModalComponent } = useConfirm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Logout failed. Please try again.");
        return;
      }

      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to reach server");
    }
  };

  const linkClasses = "flex items-center gap-1.5 text-gray-600 hover:text-[#635bff] transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-50";

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link to="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#635bff] to-[#00d4b2] bg-clip-text text-transparent">
                FreelanceHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <>
                <div className="hidden md:flex items-center gap-1">
                  <Link to="/dashboard" className={linkClasses}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/projects" className={linkClasses}>
                    <FolderOpen size={18} />
                    <span>Projects</span>
                  </Link>
                  {user.role === "freelancer" && (
                    <Link to="/my-proposals" className={linkClasses}>
                      <FileText size={18} />
                      <span>My Proposals</span>
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link to="/admin/users" className={linkClasses}>
                      <Shield size={18} />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link to="/profile" className={linkClasses}>
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50 ml-1"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && user && (
            <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-2">
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-[#635bff] transition-colors" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/projects" className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-[#635bff] transition-colors" onClick={() => setIsMenuOpen(false)}>
                <FolderOpen size={18} /> Projects
              </Link>
              {user.role === "freelancer" && (
                <Link to="/my-proposals" className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-[#635bff] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <FileText size={18} /> My Proposals
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-[#635bff] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <Shield size={18} /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-[#635bff] transition-colors" onClick={() => setIsMenuOpen(false)}>
                <User size={18} /> Profile
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {ModalComponent}
    </>
  );
}

export default Navbar;