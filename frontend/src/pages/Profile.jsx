import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../services/apiRequest";

import ReviewList from "../components/reviews/ReviewList";
import RatingSummary from "../components/reviews/RatingSummary";
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


    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response = await apiRequest(
                    `/users/${user.id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load profile"
                    );
                    return;
                }

                setProfile(data.user);

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
            loadProfile();
        }

    }, [user]);


    useEffect(() => {

        const loadReviews = async () => {

            try {

                const response =
                    await getUserReviews(user.id);

                const data =
                    await response.json();

                if (!response.ok) {
                    return;
                }

                setReviews(data.reviews);
                setAverageRating(
                    data.averageRating
                );
                setTotalReviews(
                    data.totalReviews
                );

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

            <h1>
                {profile.name}
            </h1>

            <p>
                Email: {profile.email}
            </p>

            <p>
                Role: {profile.role}
            </p>


            {profile.bio && (
                <div>

                    <h3>
                        Bio
                    </h3>

                    <p>
                        {profile.bio}
                    </p>

                </div>
            )}


            {profile.skills &&
                profile.skills.length > 0 && (

                <div>

                    <h3>
                        Skills
                    </h3>

                    <ul>

                        {profile.skills.map(
                            (skill) => (
                                <li key={skill}>
                                    {skill}
                                </li>
                            )
                        )}

                    </ul>

                </div>

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