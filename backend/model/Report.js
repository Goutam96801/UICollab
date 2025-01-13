import mongoose, { Schema } from "mongoose";

const reportSchema = mongoose.Schema({
    reported_by: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    // blogId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'blogs'
    // },
    message: {
        type: String,
        required: true
    },
    additionalMessage: {
        type: String
    },
},
    {
        timestamps: {
            createdAt: 'reportedAt'
        }

    })

export default mongoose.model("reports", reportSchema);