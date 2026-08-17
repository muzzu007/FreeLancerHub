function ReviewCard({ review }) {

    return (
        <div>

            <p>
                <strong>
                    {review.reviewer?.name}
                </strong>
            </p>

            <p>
                Rating: {review.rating}/5
            </p>

            <p>
                {review.comment}
            </p>

            {review.project?.title && (
                <p>
                    Project:{" "}
                    {review.project.title}
                </p>
            )}

            <hr />

        </div>
    );
}

export default ReviewCard;