import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import User from './model/User.js';
import Post from './model/Post.js';
import Admin from './model/Admin.js';
import Comment from './model/comment.js';
import Notification from './model/notification.js';
import { nanoid } from 'nanoid';
import Category from './model/category.js';
import axios from "axios";
import { Octokit } from "@octokit/rest";
import category from './model/category.js';
import NewsLetter from './model/NewsLetter.js';
import nodemailer from 'nodemailer';
import Blog from './model/Blog.js';


const serviceAccountKey = {
    "type": "service_account",
    "project_id": "uination",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-4h164@uination.iam.gserviceaccount.com",
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4h164%40uination.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = "main";

const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
};


const app = express();
const PORT = 5000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


mongoose.connect(process.env.MONGODB_URL, {
    autoIndex: true
});

const generateUsername = async (fullname) => {
    let username = fullname.split(" ")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result);

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

    return username;
}

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' })
    return {
        access_token,
        fullname: user.personal_info.fullname,
        email: user.personal_info.email,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        userId: user._id,
        contributor_points: user.account_info.contributor_points,
    }
}

const formatDatatoSendForAdmin = (admin) => {
    const access_token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
    return {
        access_token,
        fullname: admin.personal_info.fullname,
        email: admin.personal_info.email,
        profile_img: admin.personal_info.profile_img,
        username: admin.personal_info.username,
    }
}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(404).json({ error: "No access token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access token is invalid" });
        }
        req.user = user.id;
        next();
    });
}

// Helper function for creating notifications
const createNotification = async ({ type, message, post, user, notificationFor }) => {
    try {
        const notificationObj = {
            type,
            message,
            post,
            notification_for: notificationFor,
            user,
            timestamp: new Date(),
        };
        const notification = await new Notification(notificationObj).save();
        await User.findByIdAndUpdate(notificationFor, {
            $push: { notification: notification._id },
        });
    } catch (err) {
        console.error("Error creating notification:", err);
        throw new Error("Notification creation failed");
    }
};

app.post("/google-auth", async (req, res) => {
    const { access_token } = req.body;

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        // Check if user already exists in the database
        let user = await User.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img account_info.contributor_points")
            .then((u) => {
                return u || null;
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ error: err.message });
            });

        // If user doesn't exist, create a new one
        if (!user) {
            let username = await generateUsername(name);  // Generate a unique username based on the user's name
            user = new User({
                personal_info: { fullname: name, email, username, profile_img: picture }
            });

            // Save the new user to the database
            await user.save().then((u) => {
                user = u;
            }).catch(err => {
                console.log(err)
                return res.status(500).json({ error: err.message });
            });
        }
        return res.status(200).json(formatDatatoSend(user));
    })
        .catch((err) => {
            return res.status(500).json({ error: "Failed to authenticate you with Google. Try with another account", err });
        });
});


app.post('/github-auth', async (req, res) => {
    const { access_token } = req.body;

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        console.log(decodedUser)
        let { email, name, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img account_info.contributor_points")
            .then((u) => {
                return u || null;
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: err.message });
            });

        if (!user) {
            let username = await generateUsername(name);
            user = new User({
                personal_info: { fullname: name, email, username, profile_img: picture }
            });

            await user.save()
                .then((u) => {
                    user = u;
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ error: err.message });
                });
        }
        return res.status(200).json(formatDatatoSend(user));
    })
        .catch((err) => {
            console.error("GitHub Authentication Error: ", err);
            return res.status(500).json({ error: "Failed to authenticate with GitHub. Try with another account", err });


        })
});




// Get profile
app.post("/get-profile", async (req, res) => {
    let { username } = req.body;
    await User.findOne({ "personal_info.username": username })
        .select(" -updatedAt -posts")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.post("/get-logged-user", verifyJWT, async (req, res) => {
    let userId = req.user;

    await User.findById(userId)
        .select("")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.get("/logged-user", verifyJWT, async (req, res) => {
    let userId = req.user;

    await User.findById(userId).then((user) => {
        return res.status(200).json(user);
    }).catch(err => {
        return res.status(403).json(err);
    })
})

// Update profile

app.post("/update-profile", verifyJWT, (req, res) => {

    let { fullname, location, social_links, bio } = req.body;

    if (bio.length > 300) {
        return res.status(403).json({ error: "Bio should not exceed 300 characters." })
    }

    let socialLinksArr = Object.keys(social_links);

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(403).json({ error: "You must provide valid links." })
                }

            }
        }
    } catch (error) {
        return res.status(500).json({ error: "You must provide valid social links" })
    }

    let updateObj = {
        "personal_info.fullname": fullname,
        "personal_info.bio": bio,
        "personal_info.location": location,
        social_links
    }

    User.findOneAndUpdate({ _id: req.user }, updateObj, {
        runValidators: true
    }).then(() => {
        return res.status(200).json({ message: "Updated successfully." })
    })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

// Create Posts

app.post("/get-categories", async (req, res) => {

    await Category.find().then((category) => {
        return res.status(200).json({ category })
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
})

app.post("/get-category", async (req, res) => {

    const { name } = req.body;

    await Category.findOne({ "name": name }).then((category) => {
        return res.status(200).json({ category })
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
})

app.post("/create-post", verifyJWT, async (req, res) => {
    let { title, htmlCode, useTailwind, cssCode, category, status, theme, backgroundColor } = req.body;
    let userId = req.user;
    let incrementVal = 1;
    let post_id = category;
    let isPostIdNotUnique = await Post.exists({ "postId": post_id }).then((result) => result);

    isPostIdNotUnique ? post_id += nanoid().substring(0, 5) : "";

    const post = new Post({
        postId: post_id,
        author: userId,
        title,
        htmlCode,
        tailwindCSS: useTailwind,
        cssCode,
        category,
        theme,
        backgroundColor,
        status
    });

    await post.save().then(post => {
        User.findOneAndUpdate({ _id: userId }, { $push: { "posts": post._id } })
            .then(user => {
                Category.findOneAndUpdate({ name: category }, { $push: { "post": post._id } }).then((category) => {
                    return res.status(200).json({ message: "Post created successfully" })
                })
            })
            .catch((err) => {
                return res.status(401).json({ error: err })
            })
    }).catch((err) => {
        return res.status(500).json({ error: "Internal server errors", err })
    })
})

app.post("/trending-post", async (req, res) => {
    Post.find({ status: 'published', theme: 'dark' }).populate("author", "personal_info.username personal_info.profile_img -_id")
        .sort({
            "activity.total_saves": -1,
            "activity.total_views": -1,
            "activity.total_comments": -1,
            publishedAt: -1
        }).select("postId htmlCode cssCode category tags activity.total_views activity.total_saves activity.total_comments theme createdAt -_id")
        .limit(15).then((posts) => {
            return res.status(200).json({ posts });
        }).catch((err) => {
            return res.status(500).json({ error: err.message });
        })
})

app.post("/top-post-from-last-week", async (req, res) => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    Post.find({ status: 'published', publishedAt: { $gte: sevenDaysAgo } }).populate("author", "personal_info.username personal_info.profile_img -_id")
        .sort({
            "activity.total_saves": -1,
            "activity.total_views": -1,
            "activity.total_comments": -1,
            publishedAt: -1
        }).select("title postId htmlCode cssCode category tailwindCSS backgroundColor tags activity.total_views activity.total_saves activity.total_comments theme createdAt _id")
        .limit(15).then((posts) => {
            return res.status(200).json({ posts });
        }).catch((err) => {
            return res.status(500).json({ error: err.message });
        })
})

app.post("/top-creators", async (req, res) => {
    User.find().sort({
        "account_info.contributor_points": -1,
        "account_info.total_views": -1,
        "account_info.total_posts": -1,
        "account_info.total_blogs": -1
    }).select("personal_info.username personal_info.profile_img account_info.total_posts account_info.contributor_points")
        .limit(9).then((users) => {
            return res.status(200).json({ users })
        }).catch((err) => {
            return res.status(500).json({ error: err.message });
        })
})

app.post('/user-post', async (req, res) => {
    let { username, status, theme, sort } = req.body;

    const user = await User.findOne({ "personal_info.username": username });

    let findQuery = { status: status, author: user._id };

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    let querySort;
    if (sort === 'total_saves') {
        querySort = 'activity.total_saves'
    }
    else if (sort === 'publishedAt') {
        querySort = 'publishedAt'
    }
    else if (sort === 'views') {
        querySort = 'activity.total_views'
    }
    else {
        querySort = 'updatedAt'
    }

    Post.find(findQuery).populate('author', 'personal_info.username personal_info.profile_img -_id')
        .sort({ [querySort]: -1 })
        .select('postId htmlCode cssCode category status tags backgroundColor activity.total_views activity.total_saves activity.total_comments theme createdAt _id')
        .then(posts => {
            posts = posts.filter(post => post.author);
            return res.status(200).json({ posts });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
})

app.post('/explore-post', async (req, res) => {
    let { query, category, page, limit, theme, sort, tailwindCSS } = req.body;
    let findQuery = { status: 'published' };


    if (category) {
        findQuery.category = category;
    }

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    if (tailwindCSS == true || tailwindCSS == false) {
        findQuery.tailwindCSS = tailwindCSS
    }



    // Construct additional search criteria
    if (query) {
        const userDocs = await User.find({ "personal_info.username": new RegExp(query, "i") }).select('_id');
        const userIds = userDocs.map(user => user._id);
        findQuery.$or = [
            { tags: { $regex: query, $options: 'i' } },
            { category: new RegExp(query, "i") },
            { user: { $in: userIds } }
        ];
    }

    let maxLimit = limit ? parseInt(limit) : 6;

    let querySort;
    if (sort === 'total_saves') {
        querySort = 'activity.total_saves'
    }
    else if (sort === 'publishedAt') {
        querySort = 'publishedAt'
    }
    else if (sort === 'views') {
        querySort = 'activity.total_views'
    }
    else {
        querySort = 'updatedAt'
    }

    Post.find(findQuery)
        .populate('author', 'personal_info.username personal_info.profile_img -_id')
        .sort({ [querySort]: -1 })
        .select('postId title htmlCode cssCode category tailwindCSS backgroundColor tags activity.total_views activity.total_saves activity.total_comments theme createdAt _id')
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(posts => {
            posts = posts.filter(post => post.author);

            return res.status(200).json({ posts });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
})

app.post('/explore-post-count', async (req, res) => {
    let { query, category, page, limit, theme, sort } = req.body;
    let findQuery = { status: 'published' };

    if (category) {
        findQuery.category = category;
    }

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    // Construct additional search criteria
    if (query) {
        const userDocs = await User.find({ "personal_info.username": new RegExp(query, "i") }).select('_id');
        const userIds = userDocs.map(user => user._id);
        findQuery.$or = [
            { tags: { $regex: query, $options: 'i' } },
            { category: new RegExp(query, "i") },
            { user: { $in: userIds } }
        ];
    }

    Post.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        }).catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.post('/post-counts', async (req, res) => {
    const { categories } = req.body; // Expecting an array of categories
    try {
        const counts = await Promise.all(
            categories.map(async (category) => {
                const count = await Post.countDocuments(category === "all" ? {} : { category });
                return { category, count };
            })
        );
        return res.status(200).json(counts);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


app.post('/get-post', async (req, res) => {
    let { postId } = req.body;
    let incrementVal = 1;

    await Post.findOneAndUpdate({ "postId": postId }, { $inc: { "activity.total_views": incrementVal } })
        .populate("author", "personal_info.username personal_info.profile_img personal_info.fullname _id")
        .then((result) => {
            return res.status(200).json({ result })
        }).catch(err => {
            return res.status(500).json(err);
        })
})

app.post('/favourite-post', verifyJWT, async (req, res) => {
    const userId = req.user;

    Post.find({ user_saved: userId }).populate('author', 'personal_info.username personal_info.profile_img -_id')
        .select('postId title htmlCode cssCode category tailwindCSS backgroundColor tags activity.total_views activity.total_saves activity.total_comments theme createdAt _id')
        .then(posts => {
            if (!posts) {
                return res.status(404).json({ message: "No posts found for this user." });
            }
            return res.status(200).json({ posts });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});


app.post('/delete-post', verifyJWT, (req, res) => {
    let userId = req.user;

    let { postId } = req.body;

    Post.findOneAndDelete({ postId })
        .then((post) => {
            Notification.deleteMany({ post: post._id }).then((data) => {
                console.log("Notification deleted")
            })
            Comment.deleteMany({ post_id: post._id }).then((data) => {
                console.log("Comment deleted")
            })

            User.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: { post: post._id },
                    $inc: { "account_info.total_posts": post.status === "draft" ? 0 : -1 },
                }
            ).then((user) => {
                console.log("post deleted");
            })
            return res.status(200).json({ message: "Post deleted" })
        }).catch((err) => {
            return res.status(500).json({ error: err.message });
        });
})

app.post('/toggle-save-post', verifyJWT, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user;

    try {
        const [post, user] = await Promise.all([
            Post.findById(postId), // Use findById for a single document lookup by _id
            User.findById(userId),
        ]);

        if (!post || !user) {
            return res.status(404).json({ message: "User or Post not found" });
        }

        const previouslySaved = await Notification.findOne({
            message: `Your post \"${post.title}\" has been saved by ${user.personal_info.username}. 10 contribution points has been added to your account. Thank you!`
        });

        const isSaved = user.saved_post.includes(postId);

        if (!isSaved) {
            user.saved_post.push(postId);
            post.user_saved.push(userId);
            post.activity.total_saves += 1;

            if (!previouslySaved) {
                await createNotification({
                    type: "post_save",
                    message: `Your post \"${post.title}\" has been saved by ${user.personal_info.username}. 10 contribution points has been added to your account. Thank you!`,
                    post: post._id,
                    user: userId,
                    notificationFor: post.author,
                });

                await User.findByIdAndUpdate(post.author, {
                    $inc: { "account_info.contributor_points": 10 },
                });
            }
        } else {
            user.saved_post = user.saved_post.filter(id => id.toString() !== postId);
            post.user_saved = post.user_saved.filter(id => id.toString() !== userId);
            post.activity.total_saves -= 1;
        }

        await Promise.all([user.save(), post.save()]);

        res.status(200).json({
            isSaved: !isSaved,
            message: isSaved ? "Post unsaved" : "Post saved",
        });
    } catch (error) {
        console.error("Error toggling save status:", error);
        res.status(500).json({ message: "Failed to toggle save status" });
    }
});


app.post("/add-comment", verifyJWT, async (req, res) => {
    let user_id = req.user;

    let { _id, comment, post_author, replying_to } = req.body;

    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "Write something to leave a comment" });
    }

    try {
        const [user, post] = await Promise.all([
            User.findById(user_id),
            Post.findById(_id),
        ]);

        if (!post || !user) {
            return res.status(404).json({ message: "User or Post not found" });
        }


        let commentObj = {
            post_id: _id,
            post_author,
            comment,
            commented_by: user_id,
            parent: replying_to || null,
            isReply: !!replying_to,
        };

        const newComment = await new Comment(commentObj).save();

        post.comments.push(newComment._id);
        post.activity.total_comments += 1;
        if (!replying_to) post.activity.total_parent_comments += 1;
        await post.save();

        if (replying_to) {
            await Comment.findByIdAndUpdate(replying_to, {
                $push: { children: newComment._id },
            });
        }
        await createNotification({
            type: "comment",
            message: `${user.personal_info.username} commented on your post ${post.postId}. Thank you!`,
            post: _id,
            user: user_id,
            notificationFor: post.author,
        });

        return res.status(200).json({
            comment: newComment.comment,
            commentedAt: newComment.commentedAt,
            _id: newComment._id,
            user_id: user_id,
            children: newComment.children,
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Failed to add comment" });
    }

});

app.post("/get-post-comments", (req, res) => {
    let { post_id } = req.body;

    if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
        return res.status(400).json({ error: "Invalid or missing post_id." });
    }

    Comment.find({ "post_id": post_id, isReply: false })
        .populate(
            "commented_by",
            "personal_info.username personal_info.fullname personal_info.profile_img"
        )
        .sort({
            commentedAt: -1,
        })
        .then((comment) => {
            return res.status(200).json(comment);
        })
        .catch((err) => {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        });
});

app.post("/get-replies", (req, res) => {
    let { _id, skip } = req.body;

    Comment.findOne({ _id })
        .populate({
            path: "children",
            options: {
                sort: { commentedAt: -1 },
            },
            populate: {
                path: "commented_by",
                select:
                    "personal_info.profile_img personal_info.fullname personal_info.username",
            },
            select: "-post_id -updatedAt",
        })
        .select("children")
        .then((doc) => {
            return res.status(200).json({ replies: doc.children });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.message });
        });
});

const deleteComments = (_id) => {
    Comment.findOneAndDelete({ _id })
        .then((comment) => {
            if (comment.parent) {
                Comment.findOneAndUpdate(
                    { _id: comment.parent },
                    { $pull: { children: _id } }
                )
                    .then((data) => console.log("comment delete from parent"))
                    .catch((err) => console.log(err));
            }

            Notification.findOneAndDelete({ comment: _id }).then((notification) =>
                console.log("comment notification deleted")
            );

            Notification.findOneAndUpdate(
                { reply: _id },
                { $unset: { reply: 1 } }
            ).then((notification) => console.log("reply notification deleted"));

            Post.findOneAndUpdate(
                { _id: comment.post_id },
                {
                    $pull: { comments: _id },
                    $inc: { "activity.total_comments": -1 },
                    "activity.total_parent_comments": comment.parent ? 0 : -1,
                }
            ).then((post) => {
                if (comment.children.length) {
                    comment.children.map((replies) => {
                        deleteComments(replies);
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
};

app.post("/delete-comment", verifyJWT, (req, res) => {
    let user_id = req.user;

    let { _id } = req.body;

    Comment.findOne({ _id }).then((comment) => {
        if (user_id == comment.commented_by || user_id == comment.post_author) {
            deleteComments(_id);

            return res.status(200).json({ status: "done" });
        } else {
            return res.status(403).json({ error: "You can not delete the comment" });
        }
    });
});

app.post("/report-post", verifyJWT, async (req, res) => {

    let user_id = req.user;
    const { message, additionalMessage, post_id } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Please select or write something to report this post." })
    }

    try {
        const post = await Post.findOne({ postId: post_id });

        const alreadyReported = post.reports.some(report => report.user.toString() === user_id);

        if (alreadyReported) {
            return res.status(400).json({ error: "You have already reported this post" })
        }

        post.reports.push({
            user: user_id,
            message,
            additionalMessage
        });

        await post.save();

        return res.status(200).json({ message: "Reported Successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", error })
    }
})

app.post("/notifications", verifyJWT, async (req, res) => {
    let user_id = req.user;
    const { skip = 0, limit = 5 } = req.body;

    try {
        const findQuery = { notification_for: user_id };

        const notification = await Notification.find(findQuery).populate("post", "postId")
            .populate("user", "personal_info.username personal_info.profile_img")
            .populate("notification_for", "personal_info.username")
            .populate("blog", "blog_id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("createdAt type seen message");

        return res.status(200).json({ notification })

    } catch (error) {
        console.error("Error fetching notifications:", err.message);
        return res.status(500).json({ error: err.message });
    }
})

app.post("/mark-all-notifications-as-read", verifyJWT, async (req, res) => {
    const user_id = req.user;
    try {
        const findQuery = { notification_for: user_id, seen: true };
        await Notification.updateMany(findQuery);
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Error marking notifications as read:", err);
        return res.status(500).json({ error: err });
    }
});

app.post("/all-unread-notifications-count", verifyJWT, async (req, res) => {
    const user_id = req.user;

    try {
        const findQuery = { notification_for: user_id, seen: false };

        // Count total notifications
        const totalDocs = await Notification.countDocuments(findQuery);
        return res.status(200).json({ totalDocs });
    } catch (err) {
        console.error("Error fetching notifications count:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

app.get("/tags", async (req, res) => {
    try {
        const tags = await Post.find({ "status": "published" }, 'tags');

        const uniqueTags = [...new Set(tags.flatMap(post => post.tags))];

        return res.status(200).json({ tags: uniqueTags })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tags', error: error.message })
    }
})

app.post('/posts-by-tag', async (req, res) => {
    let { tag, page, limit, theme, sort } = req.body;
    let findQuery = { status: 'published' };


    if (!tag) {
        return res.status(400).json({ success: false, message: 'Tag parameter is required' });
    }


    if (tag) {
        findQuery.tags = tag;
    }

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    let maxLimit = limit ? limit : 6;

    Post.find(findQuery)
        .populate('author', 'personal_info.username personal_info.profile_img -_id')
        .sort({ [sort]: -1 })
        .select('postId htmlCode cssCode tailwindCSS backgroundColor category tags activity.total_views activity.total_saves activity.total_comments theme createdAt _id')
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(posts => {
            // Filter out posts where user population failed (no matching username)
            posts = posts.filter(post => post.author);

            return res.status(200).json({ posts });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });


})

// Admin Routes
// Login & Signup

// Admin Signup route

app.post("/admin/google-auth", async (req, res) => {
    const { access_token } = req.body;

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        let admin = await Admin.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img").then((u) => {
                return u || null
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message })
            })

        if (!admin) {
            let username = await generateUsername(name);
            admin = new Admin({
                personal_info: { fullname: name, email, username, profile_img: picture }
            })

            await admin.save().then((u) => {
                admin = u;
            })
                .catch(err => {
                    return res.status(500).json({ "error": err.message })
                })
        }
        return res.status(200).json(formatDatatoSendForAdmin(admin));
    })
        .catch((err) => {
            return res.status(500).json({ "error": "Failed to authenticate you with Google. Try with another account", err });
        })
})

// Admin Profile route

app.post("/create-blog", verifyJWT, (req, res) => {
    let authorId = req.user;

    let { title, label, content, banner, status, isOriginal, sourceLink, sourceCreator, id } = req.body;

    if (!title || !banner || !label || isOriginal === undefined) {
        return res.status(400).json({ message: "Missing required fields" })
    }


    let blog_id = id || title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim()
        .toLowerCase();

    if (id) {
        Blog.findOneAndUpdate({ blog_id }, { title, label, content, status, isOriginal, sourceLink, sourceCreator })
            .then(() => {
                return res.status(200).json({ id: blog_id });
            })
            .catch((err) => {
                return res.status(500).json({ error: err.message });
            });
    } else {
        let blog = new Blog({
            title,
            label,
            content,
            banner,
            status: status || 'draft',
            isOriginal,
            sourceLink,
            sourceCreator,
            blog_id,
            author: authorId,
        });
        blog.save().then((blog) => {
            let incrementVal = status === 'draft' ? 0 : 1;

            Admin.findOneAndUpdate({ _id: authorId }, {
                $inc: { "account_info.total_blogs": incrementVal },
                $push: { blogs: blog._id },
            }).then((user) => {
                return res.status(200).json({ id: blog.blog_id });
            })
                .catch((err) => {
                    return res
                        .status(500)
                        .json({ error: "Failed to update total blog number" });
                });
        })
            .catch((err) => {
                return res.status(500).json({ error: err.message });
            });
    }

})

app.post("/admin-blogs", verifyJWT, (req, res) => {
    let adminId = req.user;
    let { status } = req.body;

    let findQuery = { status: status, author: adminId };

    Blog.find(findQuery)
        .populate('author', 'personal_info.username personal_info.profile_img -_id')
        .select('blog_id title banner content status label activity isOriginal sourceCreator sourceLink publishedAt _id')
        .then(blogs => {
            return res.status(200).json(blogs);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });


})

app.post("/admin-get-blog", verifyJWT, (req, res) => {
    let adminId = req.user;
    let { blogId } = req.body;

    let findQuery = { blog_id: blogId, author: adminId };

    Blog.findOne(findQuery)
        .populate('author', 'personal_info.username personal_info.profile_img -_id')
        .select('blog_id title banner content status label activity isOriginal sourceCreator sourceLink publishedAt _id')
        .then(blog => {
            return res.status(200).json(blog);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });


})

app.post("/admin/get-profile", verifyJWT, async (req, res) => {
    let { adminId } = req.user;
    const { skip = 0, limit = 5 } = req.body;
    await Admin.findOne({ adminId })
        .select(" -updatedAt")
        .populate("post_published", "postId -_id")
        .populate("blogs", "blogId -_id")
        .populate("post_rejected", "postId -_id")
        // .populate("blog_rejected", "blogId -_id")
        .skip(skip)
        .limit(limit)
        .then(admin => {
            return res.status(200).json(admin);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.post("/admin/create-category", verifyJWT, async (req, res) => {
    let adminId = req.user;
    let { name, icon, defaultHtmlCode, defaultCssCode } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin || !admin.personal_info.isVerified) {
        return res.status(403).json({ error: "Access denied" });
    }

    const category = new Category({
        name,
        icon,
        defaultHtmlCode,
        defaultCssCode,
        author: adminId
    });

    await category.save().then(category => {
        Admin.findOneAndUpdate({ _id: adminId }, { $push: { "category_created": category._id } }).then(admin => {
            return res.status(200).json({ admin });
        })
            .catch((err) => {
                return res.status(500).json({ error: err })
            })
    }).catch(err => {
        return res.status(500).json({ error: err.message })
    })

})

app.post('/admin/posts', verifyJWT, async (req, res) => {

    let adminId = req.user;
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.personal_info.isVerified) {
        return res.status(403).json({ error: "Access denied" });
    }

    let { status } = req.body;

    await Post.find({ status: status })
        .populate("author", " personal_info.username -_id").then(post => {
            return res.status(200).json(post)
        }).catch(err => {
            return res.status(500).json({ error: "Internal server error" });
        })

})

app.post('/admin/get-post', verifyJWT, async (req, res) => {
    const admin = await Admin.findById(req.user);

    if (!admin || !admin.personal_info.isVerified) {
        return res.status(403).json({ error: "Access denied" });
    }

    let { postId } = req.body;

    await Post.findOne({ "postId": postId })
        .populate("author", "personal_info.username personal_info.profile_img -_id")
        .then((result) => {
            return res.status(200).json({ result })
        }).catch(err => {
            return res.status(500).json(err);
        })
})

const pushFileToGitHub = async (category, title, htmlCode, cssCode) => {
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Construct the file path
    const filePath = `${category}/${title}.html`; // Example: "input/Magnifying input.html"

    // Combine HTML and CSS content
    const cssBlock = cssCode ? `<style>\n${cssCode}\n</style>\n` : "";
    const combinedContent = `${cssBlock}${htmlCode}`;
    const fileContent = Buffer.from(combinedContent).toString("base64"); // Base64 encoding

    try {
        // Check if the file exists
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: filePath,
            ref: GITHUB_BRANCH,
        });

        console.log("File exists. Updating with SHA:", data.sha);

        // Update the file
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: filePath,
            message: `Updated ${title} in ${category}`,
            committer: {
                name: "Your Name",
                email: "your.email@example.com",
            },
            content: fileContent,
            sha: data.sha,
        });

        console.log("File updated successfully.");
    } catch (err) {
        if (err.status === 404) {
            console.log("File or folder does not exist. Attempting to create file...");

            // Create the new file
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: filePath,
                message: `Added ${title} to ${category}`,
                committer: {
                    name: "Your Name",
                    email: "your.email@example.com",
                },
                content: fileContent,
            });

            console.log("File created successfully.");
        } else {
            console.error("Error:", err.message);
            throw new Error("Failed to push file to GitHub");
        }
    }
};

app.post('/admin/update-post', verifyJWT, async (req, res) => {


    const { postId, status, tags } = req.body;
    const adminId = req.user;

    try {
        const admin = await Admin.findById(adminId);

        if (!admin || !admin.personal_info.isVerified) {
            return res.status(403).json({ error: "Access denied" });
        }

        const post = await Post.findOneAndUpdate(
            { postId },
            { status, tags },
            { new: true, runValidators: true }
        );

        if (!post) return res.status(404).json({ error: "Post not found" });

        const user = await User.findOne(post.author)

        await createNotification({
            type: `post_${status}`,
            message: `Your post \"${post.postId}\" has been ${status}. ${status === 'published' ? '100 contribution points have been added to your account. Thank you!' : ''}`,
            post: post._id,
            user: adminId,
            notificationFor: post.author,
        });


        if (status === 'published') {
            admin.account_info.total_post_published += 1;
            admin.post_published.push(post._id);
            user.account_info.total_posts += 1;
            user.account_info.contributor_points += 100;


            await pushFileToGitHub(post.category, post.title, post.htmlCode, post.cssCode);


        } else if (status === 'rejected') {
            admin.account_info.total_post_rejected += 1;
            admin.post_rejected.push(post._id);
        }

        await Promise.all([admin.save(), user.save()]);

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Failed to update post", error });
    }

})

app.post("/get-all-user", verifyJWT, async (req, res) => {

    const admin = await Admin.findById(req.user);

    if (!admin || !admin.personal_info.isVerified) {
        return res.status(403).json({ error: "Access denied" });
    }

    await User.find().then((user) => {
        return res.status(200).json({ user });
    }).catch(err => {
        return res.status(401).json({ error: "Unauthorized" });
    })
})

app.post('/user-count', async (req, res) => {

    User.countDocuments()
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        }).catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

async function sendConfirmationEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: '"UICollab" <your-email@gmail.com>',
        to: email,
        subject: 'Thank you for subscribing!',
        text: 'You have successfully subscribed to the UICollab newsletter.',
        html: '<p>You have successfully subscribed to the <strong>UICollab</strong> newsletter.</p>'
    };

    await transporter.sendMail(mailOptions);
}

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    console.log('Incoming email:', email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existingSubscriber = await NewsLetter.findOne({ email });
        console.log('Existing subscriber:', existingSubscriber);

        if (existingSubscriber) {
            return res.status(400).json({ message: 'You already subscribe to our newsletter.' });
        }

        const subscriber = new NewsLetter({ email });
        await subscriber.save();
        console.log('New subscriber saved:', subscriber);

        // await sendConfirmationEmail(email);
        res.status(201).json({ message: 'Thank you for subscribing to our newsletter.' });
    } catch (error) {
        console.error('Error occurred:', error); // Log the actual error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log("Server is running at PORT: " + PORT);
})