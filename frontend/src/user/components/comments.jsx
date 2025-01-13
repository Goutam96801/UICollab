import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Reply, X } from "lucide-react";
import { getDateWithTime } from "../../common/date";
import AnimationWrapper from "../../common/page-animation";
import { motion } from "framer-motion";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  let {
    userAuth: { access_token, username, profile_img },
  } = useContext(UserContext);

  const fetchComments = async () => {
    post._id &&
      axios
        .post(process.env.REACT_APP_SERVER_DOMAIN + "/get-post-comments", {
          post_id: post._id,
        })
        .then(async ({ data }) => {
          setComments(data);

          for (let comment of data) {
            if (comment.children && comment.children.length > 0) {
              await fetchReplies(comment._id);
            }
          }
        })
        .catch((err) => {
          toast.error("Error fetching comments.");
        });
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Write something to add a comment");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/add-comment",
        {
          _id: post._id,
          comment: newComment,
          post_author: post.author._id,
          replying_to: replyingTo,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      setNewComment("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      toast.error(error.response.data.error || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (commentId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/add-comment",
        {
          _id: post._id,
          comment: replyText,
          replying_to: commentId,
          post_author: post.author._id,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      toast.success("Reply added!");
      setReplyText(""); // Clear input after submission
      setActiveReplyBox(null); // Hide reply box
      fetchReplies(commentId); // Fetch updated replies
    } catch (error) {
      toast.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-replies",
        { _id: commentId }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, children: response.data.replies }
            : comment
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReplyClick = (commentId) => {
    setActiveReplyBox(activeReplyBox === commentId ? null : commentId);
    setReplyText(""); // Clear previous reply text
  };

  const toggleRepliesVisibility = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    fetchComments();
  }, [post]);

  return (
    <AnimationWrapper>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-display">Comments</h3>
        <span className="text-[#bbbbbb] text-sm font-semibold">
          {comments.length}
        </span>
      </div>
      <div className="flex gap-4 mb-4">
        <form
          className="relative p-4 [&amp;:has(:focus-visible)]:ring-4 w-full bg-[#212121] flex items-start focus-visible:border-sky-400 gap-4 focus-visible:ring-sky-400  rounded-xl overflow-hidden false"
          onSubmit={addComment}
        >
          <img
            src={profile_img}
            alt=""
            className="w-[44px] h-[44px] hidden sm:block rounded-lg flex-shrink-0"
          />
          <textarea
            className={`false w-full min-h-[48px] resize-none rounded-lg flex-1 border-solid border border-[#b4b4b411] block font-sans bg-[#a5a5a511] text-gray-200 placeholder:text-gray-400 outline-none focus:ring-0 focus:border-gray-700 px-4 py-3 overflow-hidden ${
              access_token ? "" : "disabled"
            }`}
            placeholder={`${
              access_token
                ? "Write a comment..."
                : "Please login to write a comment..."
            }`}
            value={newComment}
            rows={1}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ damping: 10, stiffness: 400, type: "spring" }}
              type="submit"
              className={`relative z-30 px-8 py-3 h-12 font-sans  disabled:cursor-auto border-none cursor-pointer bg-gradient-to-br from-purple-400 to-teal-400 text-offwhite font-semibold rounded-full disabled:bg-[#5b5b5b] ${
                newComment ? "" : "disabled"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </motion.button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {comments === null ? (
          <p>Loading...</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="flex gap-2 lg:gap-4 flex-col">
              <div className="flex relative gap-4 lg:gap-6 bg-[#212121] py-4 px-4 lg:px-6 rounded-xl overflow-hidden">
                <div>
                  <div className="flex mb-3 items-center">
                    <Link
                      to={`/profile/${comment.commented_by.personal_info.username}`}
                    >
                      <img
                        src={comment.commented_by.personal_info.profile_img}
                        alt=""
                        className="w-[50px] block h-[50px] lg:w-[40px] lg:h-[40px] rounded-lg flex-shrink-0 mr-3"
                      />
                    </Link>
                    <div className="flex flex-col items-start">
                      <Link
                        className="block"
                        to={`/profile/${comment.commented_by.personal_info.username}`}
                      >
                        <div className="font-bold text-gray-200 text-base leading-2 flex items-center gap-2">
                          {comment.commented_by.personal_info.username}{" "}
                          <span className="lg:inline hidden ml-2 font-normal text-gray-400 text-sm">
                            {getDateWithTime(comment.commentedAt)}
                          </span>
                        </div>
                      </Link>
                      <div className="flex items-center gap-4">
                        <span className="lg:hidden text-gray-400 block text-sm">
                          {getDateWithTime(comment.commentedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-200 text-base block">
                    {" "}
                    {comment.comment}{" "}
                  </p>
                  <div className="lg:absolute top-3 right-4 mt-6 lg:mt-0 font-semibold flex lg:flex-col items-center gap-2 -ml-2 lg:ml-0">
                    <button
                      onClick={() => handleReplyClick(comment._id)}
                      className={`flex items-center gap-2 text-gray-400 font-sans cursor-pointer bg-transparent hover:bg-[#3a3a3a] px-2 py-2 rounded border-none ${access_token ? '' : 'pointer-events-none'}`}
                    >
                      <Reply /> Reply
                    </button>
                    {comment.children.length > 0 && (
                      <button
                        onClick={() => toggleRepliesVisibility(comment._id)}
                        className={`flex items-center gap-2 text-gray-400 font-sans cursor-pointer bg-transparent hover:bg-[#3a3a3a] px-2 py-2 rounded border-none ${
                          comment.children.length > 0 ? "" : "hidden"
                        }`}
                      >
                        {`${
                          showReplies[comment._id]
                            ? "Hide Reply"
                            : "Show Reply"
                        } (${comment.children.length})`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {comment.children.length > 0 &&
                  !comment.isReply &&
                  showReplies[comment._id] && (
                    <AnimationWrapper>
                      {comment.children.map((reply, index) => (
                        <div className="w-full relative flex mb-2 " key={index}>
                          <div className="w-12 lg:w-24 py-2 flex justify-center items-center">
                            <button className="h-full bg-white opacity-30 w-1 rounded-full"></button>
                          </div>
                          <div className="flex flex-row w-full gap-3 bg-[#212121] py-4 px-4 lg:px-6 rounded-xl overflow-hidden">
                            <div>
                              <div className="flex mb-3 items-center">
                                <Link
                                  to={`/profile/${
                                    reply.commented_by
                                      ? reply.commented_by.personal_info
                                          .username
                                      : ""
                                  }`}
                                >
                                  <img
                                    src={
                                      reply.commented_by
                                        ? reply.commented_by.personal_info
                                            .profile_img
                                        : ""
                                    }
                                    alt=""
                                    className="w-[50px]  block h-[50px] lg:w-[40px] lg:h-[40px] rounded-lg flex-shrink-0 mr-3"
                                  />
                                </Link>
                                <div className="flex flex-col items-start">
                                  <Link
                                    className="block"
                                    to={`/profile/${
                                      reply.commented_by
                                        ? reply.commented_by.personal_info
                                            .username
                                        : "undefined"
                                    }`}
                                  >
                                    <div className="font-bold text-gray-200 text-base leading-2 flex items-center gap-2">
                                      {reply.commented_by
                                        ? reply.commented_by.personal_info
                                            .username
                                        : "anonyms"}{" "}
                                      <span className="lg:inline hidden ml-2 font-normal text-gray-400 text-sm">
                                        {getDateWithTime(reply.commentedAt)}
                                      </span>
                                    </div>
                                  </Link>
                                  <div className="flex items-center gap-4">
                                    <span className="xl:hidden text-gray-400 block text-sm">
                                      {getDateWithTime(reply.commentedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-200 text-base block">
                                {" "}
                                {reply.comment}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AnimationWrapper>
                  )}
              </div>

              {activeReplyBox === comment._id && (
                <AnimationWrapper transition={0.5}>
                  <div className="w-auto relative flex mb-2 gap-2 lg:gap-6 ">
                    <div className="w-12 lg:w-24 h-full py-2 flex justify-center">
                      <button className="h-full border-none bg-purple-500  w-1 rounded-full"></button>
                    </div>
                    <div className="flex flex-row w-full gap-3 bg-[#212121] py-4 px-4 lg:px-6 rounded-xl overflow-hidden">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full rounded-lg text-base flex-1 border-solid border border-[#575757] block font-sans bg-[#383838] text-gray-200 placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 focus:border-gray-700 px-4 py-3"
                        placeholder="Add a comment..."
                      />
                      <button
                        disabled=""
                        className="disabled:bg-[#484848] px-8 py-3 font-sans  disabled:cursor-auto bg-purple-600 border-none cursor-pointer h-full  font-semibold rounded-lg transition"
                        onClick={() => addReply(comment._id)}
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="px-4 py-3 font-sans bg-transparent transition hover:bg-[#484848] border-none cursor-pointer h-full text-offwhite font-semibold rounded-lg"
                        onClick={handleReplyClick}
                      >
                        <X />
                      </button>
                    </div>
                  </div>
                </AnimationWrapper>
              )}
            </div>
          ))
        )}
      </div>
    </AnimationWrapper>
  );
};

export default Comments;
