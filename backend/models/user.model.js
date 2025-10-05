import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email should be appropriate"]
    },
    password: {
        type: String,
        required: true,
        minlength: [10, "Password is mandatory"]
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    preferences: {
        tone: {
            type: String,
            enum: ['professional', 'casual', 'friendly'],
            default: 'casual'
        },
        theme: {
            type: String,
            enum: ['dark','light'],
            default: 'light'
        }
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
}

const User = mongoose.model("User", userSchema); 
export default User;
