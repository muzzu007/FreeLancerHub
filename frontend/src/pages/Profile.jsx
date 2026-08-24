import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import apiRequest from "../services/apiRequest";
import ReviewList from "../components/reviews/ReviewList";
import RatingSummary from "../components/reviews/RatingSummary";
import SkillsSelect from "../components/common/SkillsSelect";
import { getUserReviews } from "../services/reviewService";
import { User, Mail, Briefcase, Edit2, Save, X, Star, Code2 } from "lucide-react";

function Profile() {

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingProfile, setEditingProfile] = useState(false);
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response = await apiRequest(`/users/${user.id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Unable to load profile");
                    return;
                }

                setProfile(data.user);

            } catch (error) {

                console.error(error);
                setError("Unable to reach server");

            } finally {

                setLoading(false);

            }
        };

        if (user?.id) {
            loadProfile();
        }

    }, [user]);

    useEffect(() => {

        const loadReviews = async () => {

            try {

                const response = await getUserReviews(user.id);
                const data = await response.json();

                if (!response.ok) {
                    return;
                }

                setReviews(data.reviews);
                setAverageRating(data.averageRating);
                setTotalReviews(data.totalReviews);

            } catch (error) {

                console.error(error);

            } finally {

                setReviewsLoading(false);

            }
        };

        if (user?.id) {
            loadReviews();
        }

    }, [user]);

    const handleStartEdit = () => {
        setBio(profile.bio || "");
        setSkills(profile.skills || []);
        setEditingProfile(true);
    };

    const handleCancelEdit = () => {
        setEditingProfile(false);
        setBio("");
        setSkills([]);
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            setUpdatingProfile(true);

            const response = await apiRequest("/users/me", {
                method: "PATCH",
                body: JSON.stringify({ bio, skills })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to update profile");
                return;
            }

            setProfile(data.user);
            setEditingProfile(false);
            toast.success("Profile updated successfully");

        } catch (error) {
            console.error(error);
            toast.error("Unable to reach server");
        } finally {
            setUpdatingProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
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

    if (!profile) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                Profile not found.
            </div>
        );
    }

    const isOwnProfile = user?.id === profile._id;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#635bff] to-[#00d4b2] flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Mail size={16} />
                                    {profile.email}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Briefcase size={16} />
                                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isOwnProfile && !editingProfile && (
                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Form */}
            {editingProfile && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                            <textarea
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                maxLength={500}
                                rows={4}
                                placeholder="Tell others about yourself..."
                            />
                            <p className="text-xs text-gray-400 mt-1.5">{bio.length}/500 characters</p>
                        </div>

                        {profile.role === "freelancer" && (
                            <div className="mb-6">
                                <SkillsSelect
                                    selectedSkills={skills}
                                    onChange={setSkills}
                                    label="Your Skills"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={updatingProfile}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {updatingProfile ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={updatingProfile}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bio */}
            {profile.bio && !editingProfile && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                    <p className="text-gray-600">{profile.bio}</p>
                </div>
            )}

            {/* Skills - Freelancer only */}
            {profile.role === "freelancer" && profile.skills && profile.skills.length > 0 && !editingProfile && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-[#635bff] border border-indigo-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <RatingSummary
                    averageRating={averageRating}
                    totalReviews={totalReviews}
                />
                <ReviewList
                    reviews={reviews}
                    loading={reviewsLoading}
                />
            </div>
        </div>
    );
}

export default Profile;