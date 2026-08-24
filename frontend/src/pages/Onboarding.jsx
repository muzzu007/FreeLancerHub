import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import apiRequest from "../services/apiRequest";
import SkillsSelect from "../components/common/SkillsSelect";
import { ArrowLeft, User, FileText, Sparkles } from "lucide-react";

function Onboarding() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshUser } = useAuth();

    const role = location.state?.role || user?.role;

    const [displayName, setDisplayName] = useState(
        location.state?.name || user?.name || ""
    );

    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skipping, setSkipping] = useState(false);

    const isFreelancer = role === "freelancer";
    const isClient = role === "client";

    useEffect(() => {
        if (!role) {
            navigate("/register");
        }
    }, [role, navigate]);

    const handleComplete = async (event) => {
        event.preventDefault();

        if (!displayName.trim()) {
            toast.error("Please enter your full name");
            return;
        }

        setLoading(true);

        try {
            const updateData = {
                name: displayName.trim(),
                bio: bio.trim()
            };

            if (isFreelancer) {
                updateData.skills = skills;
            }

            const response = await apiRequest("/users/me", {
                method: "PATCH",
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to update profile");
                return;
            }

            await refreshUser();
            toast.success("Profile completed! Welcome to FreelanceHub 🎉");
            navigate("/");

        } catch (error) {
            console.error(error);
            toast.error("Unable to reach server");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setSkipping(true);
        try {
            await refreshUser();
            navigate("/");
        } catch (error) {
            console.error(error);
            navigate("/");
        } finally {
            setSkipping(false);
        }
    };

    if (!role) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-[#635bff] flex items-center justify-center mb-4">
                        <User size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-2">
                        {isClient
                            ? "Tell freelancers about your company and what you're looking for."
                            : "Tell clients about your skills and expertise."}
                    </p>
                </div>

                <form onSubmit={handleComplete}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name / Company Name *
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                            value={displayName}
                            onChange={(event) => setDisplayName(event.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                            This is the name that will be shown to other users.
                        </p>
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Bio (optional)
                        </label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder={isClient
                                ? "Tell freelancers about your company and the type of projects you post..."
                                : "Tell clients about your experience, expertise, and what you specialize in..."
                            }
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                            {bio.length}/500 characters
                        </p>
                    </div>

                    {/* Skills - Freelancer only */}
                    {isFreelancer && (
                        <div className="mb-6">
                            <SkillsSelect
                                selectedSkills={skills}
                                onChange={setSkills}
                                label="Your Skills (optional)"
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>

                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={skipping}
                            className="py-3 px-4 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {skipping ? "Redirecting..." : "Skip for now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Onboarding;