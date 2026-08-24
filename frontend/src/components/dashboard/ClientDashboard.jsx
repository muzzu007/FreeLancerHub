import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiRequest from "../../services/apiRequest";
import StatCard from "./StatCard";
import {
  Briefcase,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

function ClientDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProjects: 0,
    openProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    cancelledProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiRequest("/users/dashboard/client");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load dashboard");
          return;
        }

        setStats({
          totalProjects: data.totalProjects || 0,
          openProjects: data.openProjects || 0,
          inProgressProjects: data.inProgressProjects || 0,
          completedProjects: data.completedProjects || 0,
          cancelledProjects: data.cancelledProjects || 0,
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
        <p className="text-gray-500 mt-1">Here's an overview of your projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Briefcase}
        />
        <StatCard
          title="Open Projects"
          value={stats.openProjects}
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressProjects}
          icon={PlayCircle}
        />
        <StatCard
          title="Completed"
          value={stats.completedProjects}
          icon={CheckCircle}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelledProjects}
          icon={XCircle}
        />
      </div>
    </div>
  );
}

export default ClientDashboard;


