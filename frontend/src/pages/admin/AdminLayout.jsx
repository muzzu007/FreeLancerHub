import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Star,
} from "lucide-react";

function AdminLayout() {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-white text-[#635bff] shadow-sm"
        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
    }`;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-[#635bff]">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-500">Manage your platform</p>
          </div>
        </div>
        <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </span>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex flex-wrap gap-1 bg-gray-100/80 rounded-xl p-1 mb-6">
        <NavLink to="/admin/users" className={navLinkClasses}>
          <Users size={18} />
          Users
        </NavLink>
        <NavLink to="/admin/projects" className={navLinkClasses}>
          <FolderOpen size={18} />
          Projects
        </NavLink>
        <NavLink to="/admin/proposals" className={navLinkClasses}>
          <FileText size={18} />
          Proposals
        </NavLink>
        <NavLink to="/admin/reviews" className={navLinkClasses}>
          <Star size={18} />
          Reviews
        </NavLink>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;