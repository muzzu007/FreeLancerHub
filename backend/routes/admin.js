const express = require("express");

const User = require("../models/User");
const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const Review = require("../models/Review");
const RefreshToken = require("../models/RefreshToken");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
    "/users",
    protect,
    authorize("admin"),
    async (req, res, next) => {
        try {

            const {
                role,
                active,
                search,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (role) {
                filter.role = role;
            }

            if (active !== undefined) {
                filter.isActive = active === "true";
            }

            if (search) {
                filter.$or = [
                    {
                        name: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ];
            }

            const totalUsers = await User.countDocuments(filter);

            const totalPages = Math.ceil(
                totalUsers / Number(limit)
            );

            const skip =
                (Number(page) - 1) * Number(limit);

            const users = await User.find(filter)
                .select("-password")
                .sort("-createdAt")
                .skip(skip)
                .limit(Number(limit));

            res.status(200).json({
                users,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalUsers,
                    totalPages
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ONE USER
// =====================================================

router.get(
    "/users/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {

        try {

            const user = await User.findById(req.params.id)
                .select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json({
                user
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// SUSPEND / ACTIVATE USER
// =====================================================

router.patch(
    "/users/:id/status",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {

        try {

            const { isActive } = req.body;

            if (typeof isActive !== "boolean") {
                return res.status(422).json({
                    message: "Account status must be true or false"
                });
            }

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Prevent admin from suspending themselves
            if (user._id.toString() === req.user.userId) {
                return res.status(403).json({
                    message: "You cannot change your own account status"
                });
            }

            user.isActive = isActive;

            await user.save();

            res.status(200).json({
                message: isActive
                    ? "User activated successfully"
                    : "User suspended successfully",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// CHANGE USER ROLE
// =====================================================

router.patch(
    "/users/:id/role",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {

        try {

            const { role } = req.body;

            const allowedRoles = [
                "client",
                "freelancer",
                "admin"
            ];

            if (!allowedRoles.includes(role)) {
                return res.status(422).json({
                    message: "Invalid user role"
                });
            }

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user._id.toString() === req.user.userId) {
                return res.status(403).json({
                    message: "You cannot change your own role"
                });
            }

            user.role = role;

            await user.save();

            res.status(200).json({
                message: "User role updated successfully",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// DELETE USER
// =====================================================

router.delete(
    "/users/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {

        try {

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user._id.toString() === req.user.userId) {
                return res.status(403).json({
                    message: "You cannot delete your own account"
                });
            }

            const userProjects = await Project.find({
                client: user._id
            }).select("_id");

            const projectIds = userProjects.map(
                project => project._id
            );

            if (projectIds.length > 0) {

                await Proposal.deleteMany({
                    project: {
                        $in: projectIds
                    }
                });

                await Review.deleteMany({
                    project: {
                        $in: projectIds
                    }
                });

                await Project.deleteMany({
                    _id: {
                        $in: projectIds
                    }
                });
            }



            await Proposal.deleteMany({
                freelancer: user._id
            });

            await Project.updateMany(
                {
                    freelancer: user._id
                },
                {
                    $unset: {
                        freelancer: ""
                    }
                }
            );

            await Review.deleteMany({
                reviewer: user._id
            });

            await Review.deleteMany({
                reviewee: user._id
            });

            await RefreshToken.deleteMany({
                user: user._id
            });


            await User.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "User deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// GET ALL PROJECTS
// =====================================================

router.get(
    "/projects",
    protect,
    authorize("admin"),
    async (req, res, next) => {
        try {

            const {
                status,
                search,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (status) {
                filter.status = status;
            }

            if (search) {
                filter.title = {
                    $regex: search,
                    $options: "i"
                };
            }

            const totalProjects =
                await Project.countDocuments(filter);

            const totalPages = Math.ceil(
                totalProjects / Number(limit)
            );

            const skip =
                (Number(page) - 1) * Number(limit);

            const projects = await Project.find(filter)
                .populate("client", "name email")
                .populate("freelancer", "name email")
                .sort("-createdAt")
                .skip(skip)
                .limit(Number(limit));

            res.status(200).json({
                projects,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalProjects,
                    totalPages
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ONE PROJECT
// =====================================================

router.get(
    "/projects/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const project = await Project.findById(req.params.id)
                .populate("client", "name email")
                .populate("freelancer", "name email");

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            res.status(200).json({
                project
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// DELETE / MODERATE PROJECT
// =====================================================

router.delete(
    "/projects/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const project = await Project.findById(req.params.id);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            await Proposal.deleteMany({
                project: req.params.id
            });

            await Review.deleteMany({
                project: req.params.id
            });

            await Project.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Project removed by admin"
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ALL PROPOSALS
// =====================================================

router.get(
    "/proposals",
    protect,
    authorize("admin"),
    async (req, res, next) => {
        try {

            const {
                status,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (status) {
                filter.status = status;
            }

            const totalProposals =
                await Proposal.countDocuments(filter);

            const totalPages = Math.ceil(
                totalProposals / Number(limit)
            );

            const skip =
                (Number(page) - 1) * Number(limit);

            const proposals = await Proposal.find(filter)
                .populate("freelancer", "name email")
                .populate("project", "title budget client")
                .sort("-createdAt")
                .skip(skip)
                .limit(Number(limit));

            res.status(200).json({
                proposals,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalProposals,
                    totalPages
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ONE PROPOSAL
// =====================================================

router.get(
    "/proposals/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const proposal = await Proposal.findById(req.params.id)
                .populate("freelancer", "name email")
                .populate("project", "title description budget client");

            if (!proposal) {
                return res.status(404).json({
                    message: "Proposal not found"
                });
            }

            res.status(200).json({
                proposal
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// DELETE / MODERATE PROPOSAL
// =====================================================

router.delete(
    "/proposals/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const proposal = await Proposal.findById(req.params.id);

            if (!proposal) {
                return res.status(404).json({
                    message: "Proposal not found"
                });
            }

            await Proposal.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Proposal removed by admin"
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ALL REVIEWS
// =====================================================

router.get(
    "/reviews",
    protect,
    authorize("admin"),
    async (req, res, next) => {
        try {

            const {
                rating,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (rating) {
                filter.rating = Number(rating);
            }

            const totalReviews =
                await Review.countDocuments(filter);

            const totalPages = Math.ceil(
                totalReviews / Number(limit)
            );

            const skip =
                (Number(page) - 1) * Number(limit);

            const reviews = await Review.find(filter)
                .populate("reviewer", "name email")
                .populate("reviewee", "name email")
                .populate("project", "title")
                .sort("-createdAt")
                .skip(skip)
                .limit(Number(limit));

            res.status(200).json({
                reviews,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalReviews,
                    totalPages
                }
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET ONE REVIEW
// =====================================================

router.get(
    "/reviews/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const review = await Review.findById(req.params.id)
                .populate("reviewer", "name email")
                .populate("reviewee", "name email")
                .populate("project", "title");

            if (!review) {
                return res.status(404).json({
                    message: "Review not found"
                });
            }

            res.status(200).json({
                review
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// DELETE / MODERATE REVIEW
// =====================================================

router.delete(
    "/reviews/:id",
    protect,
    authorize("admin"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({
                    message: "Review not found"
                });
            }

            await Review.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Review removed by admin"
            });

        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;