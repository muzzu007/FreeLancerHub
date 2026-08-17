import { useAuth } from "../context/AuthContext";

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
        <div>
            <h1>
                Welcome to FreelanceHub
            </h1>

            <p>
                Dashboard unavailable for this role.
            </p>
        </div>
    );
}

export default Home;