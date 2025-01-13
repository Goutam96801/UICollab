import mongoose, { Schema } from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "This category is already added"]
    },
    icon: {
        type: String,
        required: true,
        unique: [true, "This icon is already added."],
    },
    defaultHtmlCode: {
        type: String,
        require: true,
    },
    defaultCssCode: {
        type: String,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'admin'
    },
    post: {
        type: [Schema.Types.ObjectId],
        ref: 'posts',
        default: []
    }
},
    {
        timestamps: {
            createdAt: 'createdAt'
        }

    });

export default mongoose.model('category', categorySchema)
