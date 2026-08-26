import { Link } from "react-router-dom";
import { Home, FileQuestion } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-indigo-50 text-[#635bff] flex items-center justify-center mb-6">
          <FileQuestion size={48} />
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Home Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
        >
          <Home size={20} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;