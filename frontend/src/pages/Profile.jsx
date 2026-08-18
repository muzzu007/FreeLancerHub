import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/apiRequest";

import ReviewList from "../components/reviews/ReviewList";
import RatingSummary from "../components/reviews/RatingSummary";
import SkillsSelect from "../components/common/SkillsSelect";
import { getUserReviews } from "../services/reviewService";

function Profile() {

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit profile state
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
                alert(data.message || "Unable to update profile");
                return;
            }

            setProfile(data.user);
            setEditingProfile(false);
            alert("Profile updated successfully");

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        } finally {
            setUpdatingProfile(false);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div>
            <h1>{profile.name}</h1>

            <p>Email: {profile.email}</p>
            <p>Role: {profile.role}</p>

            {profile.bio && !editingProfile && (
                <div>
                    <h3>Bio</h3>
                    <p>{profile.bio}</p>
                </div>
            )}

            {profile.role === "freelancer" && profile.skills && profile.skills.length > 0 && !editingProfile && (
                <div>
                    <h3>Skills</h3>
                    <ul>
                        {profile.skills.map((skill) => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Edit Profile Button */}
            {!editingProfile && user?.id === profile._id && (
                <button type="button" onClick={handleStartEdit}>
                    Edit Profile
                </button>
            )}

            {/* Edit Profile Form */}
            {editingProfile && (
                <form onSubmit={handleUpdateProfile}>
                    <h3>Edit Profile</h3>

                    <div>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            maxLength={500}
                            rows={4}
                        />
                    </div>

                    {profile.role === "freelancer" && (
                        <SkillsSelect
                            selectedSkills={skills}
                            onChange={setSkills}
                            label="Your Skills"
                        />
                    )}

                    <button type="submit" disabled={updatingProfile}>
                        {updatingProfile ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button" onClick={handleCancelEdit} disabled={updatingProfile}>
                        Cancel
                    </button>
                </form>
            )}

            <RatingSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
            />

            <ReviewList
                reviews={reviews}
                loading={reviewsLoading}
            />
        </div>
    );
}

export default Profile;