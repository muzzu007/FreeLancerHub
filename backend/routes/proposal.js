const express = require("express");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");


const router = express.Router();

router.post(
    "/",
    protect,
    authorize("freelancer"),
    async (req, res, next) => {
        try {
            const { project, bidAmount, coverLetter } = req.body;
            if (!project || bidAmount === undefined || !coverLetter) {
                return res.status(400).json({
                    message: "Project, bid amount and cover letter are required"
                });
            }

            if (!Number.isFinite(Number(bidAmount)) || Number(bidAmount) <= 0) {
                return res.status(422).json({
                    message: "Bid amount must be greater than 0"
                });
            }

            if (typeof coverLetter !== "string") {
                return res.status(422).json({
                    message: "Cover letter must be valid text"
                });
            }

            const cleanCoverLetter = coverLetter.trim();

            if (cleanCoverLetter.length < 20) {
                return res.status(422).json({
                    message: "Cover letter must be at least 20 characters"
                });
            }

            const existingProject = await Project.findById(project);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }


            if (existingProject.client.toString() === req.user.userId) {
                return res.status(403).json({
                    message: "You cannot submit a proposal to your own project"
                });
            }

            if (existingProject.freelancer) {
                return res.status(409).json({
                    message: "This project already has a freelancer"
                });
            }

            if (existingProject.status !== "open") {
                return res.status(409).json({
                    message: "This project is no longer accepting proposals"
                });
            }



            const existingProposal = await Proposal.findOne({
                project,
                freelancer: req.user.userId
            });

            if (existingProposal) {
                return res.status(409).json({
                    message: "You have already submitted a proposal for this project"
                });
            }

            const proposal = await Proposal.create({
                project,
                freelancer: req.user.userId,
                bidAmount: Number(bidAmount),
                coverLetter: cleanCoverLetter
            });

            res.status(201).json({
                message: "Proposal submitted successfully",
                proposal
            });

        } catch (error) {
            next(error);
        }
    });


router.get("/project/:projectId", protect, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.client.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only view proposals for your own projects"
            });
        }

        const proposals = await Proposal.find({
            project: projectId
        })
            .populate("freelancer", "name email")
            .populate("project", "title budget");

        res.status(200).json({
            proposals
        });

    } catch (error) {
        next(error);
    }
});

router.get("/my", protect, async (req, res, next) => {
    try {
        const proposals = await Proposal.find({
            freelancer: req.user.userId
        })
            .populate("project", "title description budget client");

        res.status(200).json({
            proposals
        });

    } catch (error) {
        next(error);
    }
});


router.patch(
    "/:id/status",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!["accepted", "rejected"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid proposal status"
                });
            }

            const proposal = await Proposal.findById(id);

            if (!proposal) {
                return res.status(404).json({
                    message: "Proposal not found"
                });
            }

            if (proposal.status !== "pending") {
                return res.status(409).json({
                    message: "Proposal has already been decided"
                });
            }

            const project = await Project.findById(proposal.project);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (project.client.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "Only the project owner can update proposal status"
                });
            }

            proposal.status = status;
            if (status === "accepted") {

                if (project.freelancer) {
                    return res.status(409).json({
                        message: "A freelancer has already been hired for this project"
                    });
                }

                project.freelancer = proposal.freelancer;
                project.status = "in-progress";

                await project.save();

                await Proposal.updateMany(
                    {
                        project: proposal.project,
                        _id: { $ne: proposal._id },
                        status: "pending"
                    },
                    {
                        status: "rejected"
                    }
                )
            }

            await proposal.save();

            res.status(200).json({
                message: `Proposal ${status} successfully`,
                proposal
            });

        } catch (error) {
            next(error);
        }
    });


router.delete(
    "/:id",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
    try {
        const { id } = req.params;

        const proposal = await Proposal.findById(id);

        if (!proposal) {
            return res.status(404).json({
                message: "Proposal not found"
            });
        }

        if (proposal.freelancer.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only withdraw your own proposal"
            });
        }

        if (proposal.status !== "pending") {
            return res.status(409).json({
                message: "Only pending proposals can be withdrawn"
            });
        }

        await Proposal.findByIdAndDelete(id);

        res.status(200).json({
            message: "Proposal withdrawn successfully"
        });

    } catch (error) {
        next(error);
    }
});

router.patch("/:id/withdraw", protect, authorize("freelancer"), async (req, res, next) => {
    try {

        const proposal = await Proposal.findById(req.params.id);

        if (!proposal) {
            return res.status(404).json({
                message: "Proposal not found"
            });
        }

        // Only the freelancer who created the proposal can withdraw it
        if (
            proposal.freelancer.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "You can only withdraw your own proposal"
            });
        }

        // Only pending proposals can be withdrawn
        if (proposal.status !== "pending") {
            return res.status(422).json({
                message:
                    "Only pending proposals can be withdrawn"
            });
        }

        proposal.status = "withdrawn";

        await proposal.save();

        res.status(200).json({
            message: "Proposal withdrawn successfully",
            proposal
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;