import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiRequest from "../../services/apiRequest";
import StatCard from "./StatCard";

function FreelancerDashboard() {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalProposals: 0,
        pendingProposals: 0,
        acceptedProposals: 0,
        rejectedProposals: 0,
        activeProjects: 0,
        completedProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await apiRequest("/users/dashboard/freelancer");

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load dashboard"
                    );
                    return;
                }

                setStats({
                    totalProposals: data.totalProposals || 0,
                    pendingProposals: data.pendingProposals || 0,
                    acceptedProposals: data.acceptedProposals || 0,
                    rejectedProposals: data.rejectedProposals || 0,
                    // ✅ FIX: Backend sends full project arrays, so we take .length
                    activeProjects: Array.isArray(data.activeProjects) 
                        ? data.activeProjects.length 
                        : 0,
                    completedProjects: Array.isArray(data.completedProjects) 
                        ? data.completedProjects.length 
                        : 0
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
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <p>Freelancer Dashboard</p>

            <div>
                <StatCard
                    title="Total Proposals"
                    value={stats.totalProposals}
                />

                <StatCard
                    title="Pending"
                    value={stats.pendingProposals}
                />

                <StatCard
                    title="Accepted"
                    value={stats.acceptedProposals}
                />

                <StatCard
                    title="Rejected"
                    value={stats.rejectedProposals}
                />

                <StatCard
                    title="Active Projects"
                    value={stats.activeProjects}
                />

                <StatCard
                    title="Completed Projects"
                    value={stats.completedProjects}
                />
            </div>
        </div>
    );
}

export default FreelancerDashboard;