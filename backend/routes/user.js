const express = require("express");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const AVAILABLE_SKILLS = require("../config/skills");
const validateObjectId = require("../middleware/validateObjectId");


const router = express.Router()

router.get("/me", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
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

});

router.patch("/me", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.body.name !== undefined) {
            user.name = req.body.name.trim();
        }

        if (req.body.email !== undefined) {
            const email = req.body.email.trim().toLowerCase();
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.user.userId }
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }
            user.email = email;
        }
        if (req.body.bio !== undefined) {
            const bio = req.body.bio.trim();
            if (bio.length > 500) {
                return res.status(422).json({
                    message: "Bio cannot exceed 500 characters"
                });
            }
            user.bio = bio;
        }

        if (req.body.skills !== undefined) {

            if (!Array.isArray(req.body.skills)) {
                return res.status(422).json({
                    message: "Skills must be an array"
                });
            }

            const cleanSkills = req.body.skills
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            user.skills = cleanSkills;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                skills: user.skills
            }
        });

    } catch (error) {
        next(error);
    }
});

router.patch("/me/password", protect, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(422).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(req.user.userId)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        next(error);
    }
});

router.get(
    "/:id",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select("name email role bio skills createdAt");

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
});

router.get(
    "/dashboard/client",
    protect,
    authorize("client"),
    async (req, res, next) => {
        try {

            const projects = await Project.find({
                client: req.user.userId
            });

            const totalProjects = projects.length;

            const openProjects = projects.filter(
                project => project.status === "open"
            ).length;

            const inProgressProjects = projects.filter(
                project => project.status === "in-progress"
            ).length;

            const completedProjects = projects.filter(
                project => project.status === "completed"
            ).length;

            const cancelledProjects = projects.filter(
                project => project.status === "cancelled"
            ).length;

            res.status(200).json({
                totalProjects,
                openProjects,
                inProgressProjects,
                completedProjects,
                cancelledProjects
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/dashboard/freelancer",
    protect,
    authorize("freelancer"),
    async (req, res, next) => {
        try {

            const proposals = await Proposal.find({
                freelancer: req.user.userId
            });

            const totalProposals = proposals.length;

            const pendingProposals = proposals.filter(
                proposal => proposal.status === "pending"
            ).length;

            const acceptedProposals = proposals.filter(
                proposal => proposal.status === "accepted"
            ).length;

            const rejectedProposals = proposals.filter(
                proposal => proposal.status === "rejected"
            ).length;

            const activeProjects = await Project.find({
                freelancer: req.user.userId,
                status: "in-progress"
            });

            const completedProjects = await Project.find({
                freelancer: req.user.userId,
                status: "completed"
            });

            res.status(200).json({
                totalProposals,
                pendingProposals,
                acceptedProposals,
                rejectedProposals,
                activeProjects,
                completedProjects
            });

        } catch (error) {
            next(error);
        }
    }
);


router.patch(
    "/me/skills",
    protect,
    async (req, res, next) => {
        try {

            const { skills } = req.body;

            if (!Array.isArray(skills)) {
                return res.status(422).json({
                    message: "Please select skills from the available skill list"
                });
            }

            const cleanedSkills = [
                ...new Set(
                    skills
                        .filter(skill => typeof skill === "string")
                        .map(skill => skill.trim())
                        .filter(Boolean)
                )
            ];

            const invalidSkills = cleanedSkills.filter(
                skill => !AVAILABLE_SKILLS.includes(skill)
            );

            if (invalidSkills.length > 0) {
                return res.status(422).json({
                    message: "One or more selected skills are not available"
                });
            }

            if (cleanedSkills.length > 20) {
                return res.status(422).json({
                    message: "You can select a maximum of 20 skills"
                });
            }

            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            user.skills = cleanedSkills;

            await user.save();

            res.status(200).json({
                message: "Skills updated successfully",
                skills: user.skills
            });

        } catch (error) {
            next(error);
        }
    }
);



router.get("/client-area", protect, authorize("client"), (req, res) => {
    res.json({
        message: "Welcome client"
    });

});

module.exports = router;