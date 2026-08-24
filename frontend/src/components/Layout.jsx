import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />  {/* ✅ Only ONE Navbar here */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />  {/* ✅ This renders the page content */}
      </main>
    </div>
  );
}

export default Layout;