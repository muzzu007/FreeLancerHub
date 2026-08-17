const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(422).json({
            message: "Validation failed",
            errors: Object.values(err.errors).map(error => error.message)
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            message: "A record with this value already exists"
        });
    }
    res.status(500).json({
        message: "Server error"
    });
};

module.exports = errorHandler;
