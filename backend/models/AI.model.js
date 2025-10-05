import mongoose from "mongoose";

const AISchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    model: {
        type: String,
        enum: ['gpt-4o','gpt-4'],
        default: 'gpt-4o'
    },
    inputTokens: {
        type: Number,
        required: true
    },
    outputTokens: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success','false'],
        default: 'success'
    }
}, {timestamps: true});

const AI = mongoose.model("AI", AISchema);
export default AI;
