import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type: String,
        default: "Untitled Resume",
    },
    personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },
        photoUrl: { type: String },
        showPhoto: { type: Boolean, default: false }
    },

    summary: { type: String },

    education: [
        {
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            startDate: { type: Date },
            endDate: { type: Date },
            score: { type: String }
        }
    ],

    experience: [
        {
            title: { type: String, required: true },
            company: { type: String, required: true },
            startDate: { type: Date },
            endDate: { type: Date },
            description: [{ type: String }]
        }
    ],

    projects: [
        {
            name: { type: String, required: true },
            description: { type: String },
            technologies: [{ type: String }],
            link: { type: String }
        }
    ],

    skills: [{ type: String }],

    certifications: [
        {
            title: { type: String, required: true },
            issuer: { type: String },
            date: { type: Date }
        }
    ],

    achievements: [{ type: String }],

    extraCurricular: [{ type: String }],

}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;