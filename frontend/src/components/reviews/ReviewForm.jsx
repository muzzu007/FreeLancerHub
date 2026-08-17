import { useState } from "react";
import { createReview } from "../../services/reviewService";

function ReviewForm({
    projectId,
    onReviewCreated,
    onCancel
}) {

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5");
            return;
        }

        if (comment.trim().length < 10) {
            alert(
                "Comment must be at least 10 characters"
            );
            return;
        }

        try {

            setSubmitting(true);

            const response = await createReview({
                project: projectId,
                rating,
                comment
            });

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Unable to submit review"
                );
                return;
            }

            alert(
                "Review submitted successfully"
            );

            setRating(5);
            setComment("");

            if (onReviewCreated) {
                onReviewCreated(data.review);
            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to reach server"
            );

        } finally {

            setSubmitting(false);

        }
    };


    return (
        <div>

            <h3>Write a Review</h3>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(event) =>
                            setRating(
                                Number(event.target.value)
                            )
                        }
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very Poor</option>
                    </select>

                </div>


                <div>

                    <label>
                        Comment
                    </label>

                    <textarea
                        value={comment}
                        onChange={(event) =>
                            setComment(
                                event.target.value
                            )
                        }
                        minLength={10}
                        maxLength={1000}
                        rows={5}
                    />

                </div>


                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? "Submitting..."
                        : "Submit Review"}
                </button>


                {onCancel && (

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                )}

            </form>

        </div>
    );
}

export default ReviewForm;