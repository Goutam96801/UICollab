import mongoose, { Schema } from 'mongoose';

const blogSchema = mongoose.Schema({

    blog_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: [true, "Title of your blog should be unique"],
    },
    banner:{
        type: String,
        required: true
    },
    content: {
        type: []
    },
    label: {
        type: String,
        required: true,
    },
    isOriginal: {
        type: Boolean,
        required: true,
    },
    sourceLink: {
        type: String,
        default: '',
    },
    sourceCreator: {
        type: String,
        default: '',
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'admin'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },


}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
});


export default mongoose.model('blogs', blogSchema)
