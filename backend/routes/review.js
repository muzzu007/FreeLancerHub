const express = require("express");
const Review = require("../models/Review");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");

const router = express.Router();


// CREATE REVIEW
router.post("/", protect, async (req, res, next) => {
    try {

        const {
            project: projectId,
            rating,
            comment
        } = req.body;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.status !== "completed") {
            return res.status(409).json({
                message: "Reviews can only be submitted for completed projects"
            });
        }

        const userId = req.user.userId;

        const isClient =
            project.client.toString() === userId;

        const isFreelancer =
            project.freelancer &&
            project.freelancer.toString() === userId;

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                message: "You were not part of this project"
            });
        }

        const reviewee = isClient
            ? project.freelancer
            : project.client;

        if (!reviewee) {
            return res.status(409).json({
                message: "Project does not have a valid reviewee"
            });
        }

        const existingReview = await Review.findOne({
            project: projectId,
            reviewer: userId
        });

        if (existingReview) {
            return res.status(409).json({
                message: "You have already reviewed this project"
            });
        }

        const review = await Review.create({
            project: projectId,
            reviewer: userId,
            reviewee,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        next(error);
    }
});


// GET REVIEWS FOR A PROJECT
router.get(
    "/project/:projectId",
    protect,
    validateObjectId("projectId"),
    async (req, res, next) => {
        try {

            const reviews = await Review.find({
                project: req.params.projectId
            })
                .populate("reviewer", "name role")
                .populate("reviewee", "name role");

            res.status(200).json({
                reviews
            });

        } catch (error) {
            next(error);
        }
    });


// GET REVIEWS RECEIVED BY A USER
router.get(
    "/user/:userId",
    protect,
    validateObjectId("userId"),
    async (req, res, next) => {
        try {

            const reviews = await Review.find({
                reviewee: req.params.userId
            })
                .populate("reviewer", "name role")
                .populate("project", "title");

            const totalReviews = reviews.length;

            const averageRating = totalReviews
                ? reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / totalReviews
                : 0;

            res.status(200).json({
                reviews,
                totalReviews,
                averageRating: Number(averageRating.toFixed(2))
            });

        } catch (error) {
            next(error);
        }
    });


module.exports = router;