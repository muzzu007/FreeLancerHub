import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiRequest from "../../services/apiRequest";
import StatCard from "./StatCard";

function ClientDashboard() {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalProjects: 0,
        openProjects: 0,
        inProgressProjects: 0,
        completedProjects: 0,
        cancelledProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await apiRequest("/users/dashboard/client");

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load dashboard"
                    );
                    return;
                }

                setStats({
                    totalProjects: data.totalProjects || 0,
                    openProjects: data.openProjects || 0,
                    inProgressProjects: data.inProgressProjects || 0,
                    completedProjects: data.completedProjects || 0,
                    cancelledProjects: data.cancelledProjects || 0
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
            <p>Client Dashboard</p>

            <div>
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                />

                <StatCard
                    title="Open Projects"
                    value={stats.openProjects}
                />

                <StatCard
                    title="Active Projects"
                    value={stats.inProgressProjects}
                />

                <StatCard
                    title="Completed Projects"
                    value={stats.completedProjects}
                />

                <StatCard
                    title="Cancelled Projects"
                    value={stats.cancelledProjects}
                />
            </div>
        </div>
    );
}

export default ClientDashboard;