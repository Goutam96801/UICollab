import mongoose, { Schema } from 'mongoose';

const AdminSchema = mongoose.Schema({
    personal_info: { 
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullname: {
            type: String
        },
        profile_img:{
            type:String,
            required:true,
            default:""
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    account_info: {
        total_post_published: {
            type: Number,
            default: 0
        },
        total_blog_published: {
            type: Number,
            default: 0
        },
        total_post_rejected: {
            type: Number,
            default: 0
        },
        total_blog_rejected: {
            type: Number,
            default: 0
        },

    },

    category_created:{
        type: [Schema.Types.ObjectId],
        ref: "category",
        default: [],
    },

    post_published: {
        type: [Schema.Types.ObjectId],
        ref: "posts",
        default: [],
    },
    blog_published: {
        type: [Schema.Types.ObjectId],
        ref: "blogs",
        default: [],
    },

    post_rejected: {
        type: [Schema.Types.ObjectId],
        ref: "posts",
        default: [],
    },
    blog_rejected: {
        type: [Schema.Types.ObjectId],
        ref: "blogs",
        default: [],
    },
},
    {
        timestamps: {
            createdAt: "joinedAt",
        },
    }

)

export default mongoose.model("admin", AdminSchema);