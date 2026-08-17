const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const { protect, authorize } = require("../middleware/authMiddleware");
const AVAILABLE_SKILLS = require("../config/skills");
const User = require("../models/User");
const validateObjectId = require("../middleware/validateObjectId");
const Review = require("../models/Review");

router.post(
    "/",
    protect,
    authorize("client"),
    async (req, res, next) => {
        try {
            const {
                title,
                description,
                budget,
                skills = []
            } = req.body;

            if (
                typeof title !== "string" ||
                typeof description !== "string"
            ) {
                return res.status(422).json({
                    message: "Title and description must be text"
                });
            }

            if (!title || !description || budget === undefined) {
                return res.status(400).json({
                    message: "Title, description and budget are required"
                });
            }

            if (title.trim().length < 3) {
                return res.status(422).json({
                    message: "Project title must be at least 3 characters"
                });
            }

            if (description.trim().length < 10) {
                return res.status(422).json({
                    message: "Project description must be at least 10 characters"
                });
            }

            if (!Array.isArray(skills)) {
                return res.status(422).json({
                    message: "Please select skills from the available skill list"
                });
            }

            const cleanTitle = title.trim();
            const cleanDescription = description.trim();
            const cleanBudget = Number(budget);
            const cleanSkills = [
                ...new Set(
                    skills
                        .filter(skill => typeof skill === "string")
                        .map(skill => skill.trim())
                        .filter(Boolean)
                )
            ];

            if (cleanBudget <= 0) {
                return res.status(422).json({
                    message: "Budget must be greater than 0"
                });
            }
            const invalidSkills = cleanSkills.filter(
                skill => !AVAILABLE_SKILLS.includes(skill)
            );

            if (invalidSkills.length > 0) {
                return res.status(422).json({
                    message: "One or more selected skills are not available"
                });
            }

            const project = await Project.create({
                title: cleanTitle,
                description: cleanDescription,
                budget: cleanBudget,
                skills: cleanSkills,
                client: req.user.userId
            });

            res.status(201).json({
                message: "Project created successfully",
                project
            });

        } catch (error) {
            next(error);
        }
    }
);


router.get("/", protect, async (req, res, next) => {
    try {

        const { search,
            minBudget,
            maxBudget,
            status,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (minBudget) {
            filter.budget = {
                ...filter.budget,
                $gte: Number(minBudget)
            };
        }

        if (maxBudget) {
            filter.budget = {
                ...filter.budget,
                $lte: Number(maxBudget)
            };
        }
        if (status) {
            filter.status = status;
        }

        const totalProjects = await Project.countDocuments(filter);
        const totalPages = Math.ceil(
            totalProjects / Number(limit)
        );
        const skip = (Number(page) - 1) * Number(limit);
        const projects = await Project.find(filter)
            .populate("client", "name email role")
            .sort(sort || "-createdAt")
            .skip(skip)
            .limit(Number(limit))

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
});


router.get(
    "/recommended",
    protect,
    authorize("freelancer"),
    async (req, res, next) => {
        try {

            const user = await User.findById(req.user.userId)
                .select("skills");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const freelancerSkills = user.skills || [];

            const projects = await Project.find({
                status: "open"
            })
                .populate("client", "name email role")
                .sort("-createdAt");

            const recommendedProjects = projects.map(project => {

                const projectSkills = project.skills || [];

                if (projectSkills.length === 0) {
                    return {
                        ...project.toObject(),
                        matchPercentage: 0
                    };
                }

                const matchingSkills = projectSkills.filter(
                    skill => freelancerSkills.includes(skill)
                );

                const matchPercentage = Math.round(
                    (matchingSkills.length / projectSkills.length) * 100
                );

                return {
                    ...project.toObject(),
                    matchingSkills,
                    matchPercentage
                };

            });

            recommendedProjects.sort(
                (a, b) => b.matchPercentage - a.matchPercentage
            );

            res.status(200).json({
                projects: recommendedProjects
            });

        } catch (error) {
            next(error);
        }
    }
);


router.patch(
    "/:id",
    protect,
    authorize("client"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {
            const { id } = req.params;

            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (project.client.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You can only update your own projects"
                });
            }

            // Don't allow editing a project that is already being worked on
            if (project.status !== "open") {
                return res.status(409).json({
                    message: "Only open projects can be edited"
                });
            }

            const { title, description, budget } = req.body;

            if (title !== undefined) {

                if (typeof title !== "string") {
                    return res.status(422).json({
                        message: "Project title must be text"
                    });
                }

                const cleanTitle = title.trim();

                if (cleanTitle.length < 3) {
                    return res.status(422).json({
                        message: "Project title must be at least 3 characters"
                    });
                }

                project.title = cleanTitle;
            }

            if (description !== undefined) {

                if (typeof description !== "string") {
                    return res.status(422).json({
                        message: "Project description must be text"
                    });
                }

                const cleanDescription = description.trim();

                if (cleanDescription.length < 10) {
                    return res.status(422).json({
                        message: "Project description must be at least 10 characters"
                    });
                }

                project.description = cleanDescription;
            }

            if (budget !== undefined) {

                const cleanBudget = Number(budget);

                if (!Number.isFinite(cleanBudget) || cleanBudget <= 0) {
                    return res.status(422).json({
                        message: "Budget must be greater than 0"
                    });
                }

                project.budget = cleanBudget;
            }

            if (req.body.skills !== undefined) {

                if (!Array.isArray(req.body.skills)) {
                    return res.status(422).json({
                        message: "Please select skills from the available skill list"
                    });
                }

                const cleanSkills = [
                    ...new Set(
                        req.body.skills
                            .filter(skill => typeof skill === "string")
                            .map(skill => skill.trim())
                            .filter(Boolean)
                    )
                ];

                const invalidSkills = cleanSkills.filter(
                    skill => !AVAILABLE_SKILLS.includes(skill)
                );

                if (invalidSkills.length > 0) {
                    return res.status(422).json({
                        message: "One or more selected skills are not available"
                    });
                }

                project.skills = cleanSkills;
            }

            await project.save();

            res.status(200).json({
                message: "Project updated successfully",
                project
            });

        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/:id/status",
    protect,
    authorize("client"),
    validateObjectId("id"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (project.client.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You can only update your own projects"
                });
            }

            if (
                status === "completed" &&
                !project.freelancer
            ) {
                return res.status(409).json({
                    message: "A project cannot be completed without a freelancer"
                });
            }

            const validTransitions = {
                open: ["cancelled"],
                "in-progress": ["completed"],
                completed: [],
                cancelled: []
            };

            if (!validTransitions[project.status].includes(status)) {
                return res.status(409).json({
                    message: `Cannot change project status from ${project.status} to ${status}`
                });
            }

            project.status = status;

            await project.save();

            res.status(200).json({
                message: "Project status updated successfully",
                project
            });

        } catch (error) {
            next(error);
        }
    }
);



router.delete(
    "/:id",
    protect,
    authorize("client"),
    validateObjectId("id"),
    async (req, res, next) => {

        try {

            const { id } = req.params;

            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (project.client.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You can only delete your own projects"
                });
            }

            if (project.status !== "open") {
                return res.status(409).json({
                    message: "Only open projects can be deleted"
                });
            }

            if (project.freelancer) {
                return res.status(409).json({
                    message: "You cannot delete a project that already has a freelancer"
                });
            }

            await Proposal.deleteMany({
                project: id
            });

            await Review.deleteMany({
                project: id
            });

            await Project.findByIdAndDelete(id);

            res.status(200).json({
                message: "Project deleted successfully"
            });

        } catch (error) {

            next(error);

        }
    }
);

module.exports = router;