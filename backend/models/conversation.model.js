import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        maxlength: 20,
        trim: true
    },
    messages: [
      {
      type: String,
      enum: ['user','ai'],
      default: 'user',
      validate: {
        validator: v.trim() === '',
        message: "Messages cannot be empty"
      }
     }
    ],
    tags: [
      {
      type: String,
      required: true
      }
    ]
}, {timestamps: true});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;