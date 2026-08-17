function RatingSummary({
    averageRating,
    totalReviews
}) {

    return (
        <div>

            <h3>
                Rating Summary
            </h3>

            <p>
                Average Rating:{" "}
                {averageRating}/5
            </p>

            <p>
                Total Reviews:{" "}
                {totalReviews}
            </p>

        </div>
    );
}

export default RatingSummary;