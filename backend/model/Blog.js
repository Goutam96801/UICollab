import mongoose, {Schema} from 'mongoose';

const blogSchema = mongoose.Schema({
    BlogId:{
        type:String,
        required:true,
        unique:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    htmlCode: {
        type: String,
        required: true
    },
    cssCode: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // Added by admin after review
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'under review', 'published'],
        default: 'draft'
    },
    saved: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0 
    },
    reports: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'users' }, // Reference to the user who reported
            message: { type: String, required: true }, // Report reason/message
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('blogs', blogSchema)
