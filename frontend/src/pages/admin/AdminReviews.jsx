import { useEffect, useState } from "react";
import {
    getAdminReviews,
    deleteReviewAsAdmin
} from "../../services/adminService";

function AdminReviews() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0
    });

    const [filters, setFilters] = useState({
        rating: "",
        page: 1,
        limit: 10
    });

    const loadReviews = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            const response = await getAdminReviews({ ...filters, page });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to load reviews");
                return;
            }

            setReviews(data.reviews);
            setPagination(data.pagination);

        } catch (error) {

            console.error(error);
            setError("Unable to reach server");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadReviews(1);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        loadReviews(1);
    };

    const handleClearFilters = () => {
        setFilters({
            rating: "",
            page: 1,
            limit: 10
        });
        loadReviews(1);
    };

    const handleDeleteReview = async (reviewId) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        try {
            const response = await deleteReviewAsAdmin(reviewId);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to delete review");
                return;
            }

            setReviews(prev => prev.filter(r => r._id !== reviewId));
            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    if (loading && reviews.length === 0) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Manage Reviews</h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange("rating", e.target.value)}
                >
                    <option value="">All Ratings</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                <button onClick={handleApplyFilters}>Apply</button>
                <button onClick={handleClearFilters}>Clear</button>
            </div>

            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                                <th>Project</th>
                                <th>Reviewer</th>
                                <th>Reviewee</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td>{review.project?.title || "Unknown"}</td>
                                    <td>{review.reviewer?.name || "Unknown"}</td>
                                    <td>{review.reviewee?.name || "Unknown"}</td>
                                    <td>{review.rating}/5</td>
                                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {review.comment}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteReview(review._id)} style={{ color: "red" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ marginTop: "16px" }}>
                        <button
                            disabled={pagination.currentPage <= 1}
                            onClick={() => loadReviews(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span style={{ margin: "0 12px" }}>
                            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalReviews} reviews)
                        </span>
                        <button
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => loadReviews(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminReviews;