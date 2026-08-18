import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Onboarding from "./pages/Onboarding";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import MyProposals from "./pages/MyProposals";
import ProjectDetails from "./pages/ProjectDetails";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProposals from "./pages/admin/AdminProposals";
import AdminReviews from "./pages/admin/AdminReviews";



function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="/onboarding" element={<Onboarding />} />


                    {/* Protected routes with Navbar */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:projectId" element={<ProjectDetails />} />
                            <Route path="/my-proposals" element={<MyProposals />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        {/* Admin routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="projects" element={<AdminProjects />} />
                                <Route path="proposals" element={<AdminProposals />} />
                                <Route path="reviews" element={<AdminReviews />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;