import ReviewCard from "./ReviewCard";

function ReviewList({
    reviews,
    loading = false
}) {

    if (loading) {
        return (
            <p>
                Loading reviews...
            </p>
        );
    }


    if (!reviews || reviews.length === 0) {
        return (
            <p>
                No reviews found.
            </p>
        );
    }


    return (
        <div>

            <h3>Reviews</h3>

            {reviews.map((review) => (

                <ReviewCard
                    key={review._id}
                    review={review}
                />

            ))}

        </div>
    );
}

export default ReviewList;