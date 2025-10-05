import { response } from "express";
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: false    
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: false
    },
    type: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: function() {
            return this.type !== 'rating';
        }
    },
    content: {
        type: String,
        required: function() {
            return this.type === 'rating';
        },
        maxlength: 800
    },
    status: {
        type: String,
        enum: ['open', 'resolved', 'reviewed', 'rejected'],
        default: 'open'
    },
    metadata: {
        browser: Object,
        os: String,
        ipAddresses: [String],
    },
    adminResponse: {
        response: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        respondedAt: Date
    }

}, {timestamps: true});

feedbackSchema.methods.updateTimestamp = function() {
    this.adminResponse.respondedAt = new Date();
}

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
