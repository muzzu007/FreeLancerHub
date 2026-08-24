import { useAuth } from "../hooks/useAuth";
import ClientDashboard from "../components/dashboard/ClientDashboard";
import FreelancerDashboard from "../components/dashboard/FreelancerDashboard";

function Home() {
  const { user } = useAuth();

  if (user?.role === "client") {
    return <ClientDashboard />;
  }

  if (user?.role === "freelancer") {
    return <FreelancerDashboard />;
  }

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold">Welcome to FreelanceHub</h1>
      <p className="text-gray-500">Dashboard unavailable for this role.</p>
    </div>
  );
}

export default Home;