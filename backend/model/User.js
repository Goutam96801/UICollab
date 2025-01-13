import mongoose, {Schema} from "mongoose";
const userSchema = mongoose.Schema({
    personal_info:{
        fullname: {
            type:String,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true
        },
        profile_img: {
            type: String,
            required: true,
            default:""
        },
        bio:{
            type: String,
            maxlength: [300, 'Bio should not be more than 300'],
            default: "",
        },
        location:{
            type:String,
            default:"",
            maxlength:[200, 'Location should not be more than 200']
        }
    },
    social_links:{
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0,
          },
          total_blogs: {
            type: Number,
            default: 0,
          },
        contributor_points:{
            type:Number,
            default:0
        },
    },
    activity:{
        total_views:{
            type:Number,
            default:0
        },
        total_profile_visits:{
            type:Number,
            default:0
        },
    },
    posts: {
        type: [ Schema.Types.ObjectId ],
        ref: 'posts',
        default: [],
    },
    blogs: {
        type: [ Schema.Types.ObjectId ],
        ref: 'blogs',
        default: [],
    },
    saved_post: {
        type: [ Schema.Types.ObjectId ],
        ref: 'posts',
        default: []
    },
    notification:{
        type:[Schema.Types.ObjectId],
        ref:'notification',
        default:[]
    }
},
{
    timestamps:{
        createdAt:'joinedAt'
    }
}
)


export default mongoose.model("users", userSchema);