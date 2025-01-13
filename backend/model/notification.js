import mongoose, { Schema } from "mongoose";

const notificationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ["post_published", "blog_published", "post_rejected", "blog_rejected", "comment", "post_save", "other"],
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'blogs'
    },
    notification_for: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: "String",
        required: true,
    },
    seen: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model("notification", notificationSchema)