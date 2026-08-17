import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiRequest from "../../services/apiRequest";
import StatCard from "./StatCard";


function ClientDashboard() {

    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadProjects = async () => {

            try {

                const response =
                    await apiRequest("/projects");

                const data =
                    await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load dashboard"
                    );
                    return;
                }

                setProjects(data.projects || []);

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to reach server"
                );

            } finally {

                setLoading(false);

            }
        };


        if (user?.id) {
            loadProjects();
        }

    }, [user]);


    if (loading) {
        return <p>Loading dashboard...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    const myProjects = projects.filter(
        (project) =>
            project.client?._id === user?.id
    );


    const openProjects = myProjects.filter(
        (project) =>
            project.status === "open"
    );


    const activeProjects = myProjects.filter(
        (project) =>
            project.status === "in-progress"
    );


    const completedProjects = myProjects.filter(
        (project) =>
            project.status === "completed"
    );


    return (
        <div>

            <h1>
                Welcome, {user?.name}
            </h1>

            <p>
                Client Dashboard
            </p>


            <div>

                <StatCard
                    title="Total Projects"
                    value={myProjects.length}
                />

                <StatCard
                    title="Open Projects"
                    value={openProjects.length}
                />

                <StatCard
                    title="Active Projects"
                    value={activeProjects.length}
                />

                <StatCard
                    title="Completed Projects"
                    value={completedProjects.length}
                />

            </div>

        </div>
    );
}

export default ClientDashboard;