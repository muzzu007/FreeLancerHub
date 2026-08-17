import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProctectedRoute";
import PublicRoute from "./components/PublicRoute";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";

function App() {
    return (
        <AuthProvider>


            <BrowserRouter>

                <Routes>

                    {/* Public routes */}
                    <Route element={<PublicRoute />}>
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />
                    </Route>

                    {/* Routes with Navbar */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<Layout />}>

                            <Route
                                path="/"
                                element={<Home />}
                            />

                            <Route
                                path="/projects"
                                element={<Projects />}
                            />

                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                        </Route>

                    </Route>

                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;