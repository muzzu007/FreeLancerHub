import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiRequest from "../../services/apiRequest";
import { getRecommendedProjects } from "../../services/projectService";
import StatCard from "./StatCard";
import ProjectCard from "../projects/ProjectCard";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";

function FreelancerDashboard() {
  const { user } = useAuth();

  // Stats state
  const [stats, setStats] = useState({
    totalProposals: 0,
    pendingProposals: 0,
    acceptedProposals: 0,
    rejectedProposals: 0,
    activeProjects: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recommended projects state
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState("");

  // Load dashboard stats
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiRequest("/users/dashboard/freelancer");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load dashboard");
          return;
        }

        setStats({
          totalProposals: data.totalProposals || 0,
          pendingProposals: data.pendingProposals || 0,
          acceptedProposals: data.acceptedProposals || 0,
          rejectedProposals: data.rejectedProposals || 0,
          activeProjects: Array.isArray(data.activeProjects)
            ? data.activeProjects.length
            : 0,
          completedProjects: Array.isArray(data.completedProjects)
            ? data.completedProjects.length
            : 0,
        });
      } catch (error) {
        console.error(error);
        setError("Unable to reach server");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboard();
    }
  }, [user]);

  // Load recommended projects
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const response = await getRecommendedProjects();
        const data = await response.json();

        if (!response.ok) {
          setErrorRecommended(data.message || "Unable to load recommendations");
          return;
        }

        setRecommendedProjects(data.projects || []);
      } catch (error) {
        console.error(error);
        setErrorRecommended("Unable to reach server");
      } finally {
        setLoadingRecommended(false);
      }
    };

    if (user?.id) {
      loadRecommended();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your freelancing activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        <StatCard title="Total Proposals" value={stats.totalProposals} icon={FileText} />
        <StatCard title="Pending" value={stats.pendingProposals} icon={Clock} />
        <StatCard title="Accepted" value={stats.acceptedProposals} icon={UserCheck} />
        <StatCard title="Rejected" value={stats.rejectedProposals} icon={UserX} />
        <StatCard title="Active Projects" value={stats.activeProjects} icon={CheckCircle} />
        <StatCard title="Completed" value={stats.completedProjects} icon={CheckCircle} />
      </div>

      {/* ========================================== */}
      {/* RECOMMENDED PROJECTS SECTION */}
      {/* ========================================== */}

      <div className="border-t border-gray-200 pt-8 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-[#635bff]" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
        </div>
        <p className="text-gray-500 mb-6">Projects matched to your skills</p>

        {loadingRecommended ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#635bff] mx-auto"></div>
              <p className="mt-3 text-gray-500 text-sm">Loading recommendations...</p>
            </div>
          </div>
        ) : errorRecommended ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorRecommended}
          </div>
        ) : recommendedProjects.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No recommendations available yet.{" "}
              <span className="block mt-1 text-sm">
                Add more skills to your profile to get better matches!
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;