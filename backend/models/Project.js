const mongoose = require("mongoose");

const projectschema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
            minlength: [3, "Project title must be at least 3 characters"],
            maxlength: [100, "Project title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
            minlength: [10, "Project description must be at least 10 characters"]
        },
        budget: {
            type: Number,
            required: [true, "Budget is required"],
            min: [1, "Budget must be greater than 0"]
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "completed", "cancelled"],
            default: "open"
        },
        skills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectschema);