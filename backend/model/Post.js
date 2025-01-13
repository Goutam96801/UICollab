import mongoose, { Schema } from 'mongoose';

const postSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true
    },
    title:{
        type:String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    htmlCode: {
        type: String,
        required: true
    },
    tailwindCSS: {
        type:Boolean,
        default: false
    },
    cssCode: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    backgroundColor:{
        type:String,
        required:true,
        default:"#212121"
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    status: {
        type: String,
        enum: ['draft', 'under_review', 'published', 'rejected'],
        default: 'draft'
    },

    activity:{
        
    total_saves: {
        type: Number,
        default: 0
    },
    total_views: {
        type: Number,
        default: 0
    },
    total_comments:{
        type: Number,
        default: 0
    },
    total_parent_comments:{
        type: Number,
        default: 0
    }
    },
    
    reports: {
        type:[Schema.Types.ObjectId],
        ref:'reports',
        default:[]
    },

    user_saved: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },

    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    });

export default mongoose.model('posts', postSchema)
