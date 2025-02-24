import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../App";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { CircleCheck, BookCheck, Ban, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { removeFromSession } from "../../common/session";

const adminDataStructure = {
  personal_info: {
    username: "",
    email: "",
    fullname: "",
    profile_img: "",
    isVerified: false,
  },
  account_info: {
    total_post_published: 0,
    total_blogs: 0,
    total_post_rejected: 0,
  },
  post_published: [],
  blogs: [],
  post_rejected: [],
  joinedAt: "",
};

export default function AdminDashboard(props) {
  const [activeTab, setActiveTab] = useState("published");
  const [adminData, setAdminData] = useState(adminDataStructure);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllRejectedPosts, setShowAllRejectedPosts] = useState(false);
  const [showAllRejectedBlogs, setShowAllRejectedBlogs] = useState(false);

  let {
    adminAuth: { access_token },
    setAdminAuth,
  } = useContext(AdminContext);

  let {
    personal_info: { username, email, fullname, profile_img, isVerified },
    account_info: { total_post_published, total_blogs, total_post_rejected },
    post_published,
    blogs,
    post_rejected,
    joinedAt,
  } = adminData;

  const fetchAdminProfile = async () => {
    access_token &&
      (await axios
        .post(
          process.env.REACT_APP_SERVER_DOMAIN + "/admin/get-profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          setAdminData(data);
        })
        .catch((err) => {
          console.log(err);
        }));
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [access_token]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogout = () => {
    props.setProgress(70);
    setTimeout(() => {
      props.setProgress(100);
      removeFromSession("admin");
      setAdminAuth({ access_token: null });
    }, 1000);
  };

  return access_token ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 mx-auto p-6 h-[100vh] w-[calc(100vw-250px)] overflow-y-auto"
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
          Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-lg font-bold flex items-center gap-1 border border-[#212121] rounded-lg hover:bg-[#212121] duration-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <div className=" rounded-lg shadow-xl bg- p-6 bg-gray-900">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="flex items-center space-x-4">
            <img
              src={profile_img}
              alt={fullname}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold flex gap-2 items-center">
                <p>{fullname}</p>
                {isVerified ? (
                  <CircleCheck className="text-green-600 w-5 h-5 text-center" />
                ) : (
                  ""
                )}
              </h3>
              <p className="text-sm text-gray-600">@{username}</p>
              <p className="text-sm">{email}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Joined on: {new Date(joinedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Account Statistics Card */}
        <div className=" rounded-lg shadow-xl bg-gray-900 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Posts Published</p>
              <p className="text-2xl font-bold text-green-500">
                {total_post_published}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Blogs Published</p>
              <p className="text-2xl font-bold text-green-500">{total_blogs}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Posts Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {total_post_rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1">
            <button
              className={`py-2 px-4 text-center text-green-500 font-medium text-base flex gap-2 duration-300 rounded ${
                activeTab === "published"
                  ? "bg-gray-800"
                  : "  hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("published")}
            >
              <BookCheck />
              Published Content
            </button>
            <button
              className={` py-2 px-4 text-center text-red-500 font-medium text-base rounded flex gap-2 duration-300 ${
                activeTab === "rejected"
                  ? "bg-gray-800"
                  : "  hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              <Ban />
              Rejected Content
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "published" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Published Posts */}
              <div className=" rounded-lg shadow-xl bg-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-2">Published Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently published posts
                </p>
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {post_published.length === 0 && (
                    <p>You have not published any post.</p>
                  )}
                  {(showAllPosts
                    ? post_published
                    : post_published.slice(0, 5)
                  ).map((post, index) => (
                    <motion.a
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      href={`/admin/posts/${username}/${post.postId}`}
                      key={index}
                      className="flex items-center space-x-2 bg-[#1c1c1c] py-2 px-2 rounded-full"
                    >
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{post.postId}</span>
                    </motion.a>
                  ))}
                </motion.ul>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className={`mt-4 w-auto py-2.5 px-4 rounded-full bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 border-[#2a2a2a] border-2 ${
                    post_published.length <= 5
                      ? "opacity-20 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={post_published.length <= 5}
                >
                  {showAllPosts ? "Show Less" : "View All Published Posts"}
                </motion.button>
              </div>

              {/* Published Blogs */}
              <div className=" rounded-lg shadow-xl bg-gray-800 p-6 ">
                <h3 className="text-lg font-semibold mb-2">Published Blogs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently published blogs
                </p>
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {blogs.length === 0 && (
                    <p>You have not published any blog.</p>
                  )}
                  {(showAllBlogs ? blogs : blogs.slice(0, 5)).map(
                    (blog, index) => (
                      <motion.a
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        href={`/admin/posts/${username}/${blog}`}
                        key={index}
                        className="flex items-center space-x-2 bg-[#1c1c1c] py-2 px-2 rounded-full"
                      >
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{blog}</span>
                      </motion.a>
                    )
                  )}
                </motion.ul>
                <button
                  className={`mt-4 w-auto py-2.5 px-4 rounded-full bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 border-[#2a2a2a] border-2 ${
                    blogs.length <= 5 ? "opacity-20 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setShowAllBlogs(!showAllBlogs)}
                  disabled={blogs.length <= 5}
                >
                  {showAllBlogs ? "Show Less" : "View All Published Posts"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "rejected" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Rejected Posts */}
              <div className=" rounded-lg shadow-xl bg-[#a5a5a511] p-6">
                <h3 className="text-lg font-semibold mb-2">Rejected Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently rejected posts
                </p>
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {post_rejected.length === 0 && (
                    <p>You have not rejected any post.</p>
                  )}
                  {(showAllRejectedPosts
                    ? post_rejected
                    : post_rejected.slice(0, 5)
                  ).map((post, index) => (
                    <motion.a
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      href={`/admin/posts/${username}/${post.postId}`}
                      key={index}
                      className="flex items-center space-x-2 bg-[#1c1c1c] py-2 px-2 rounded-full"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{post.postId}</span>
                    </motion.a>
                  ))}
                </motion.ul>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setShowAllRejectedPosts(!showAllRejectedPosts)}
                  className={`mt-4 w-auto py-2.5 px-4 rounded-full bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 border-[#2a2a2a] border-2 ${
                    post_rejected.length <= 5
                      ? "opacity-20 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={post_rejected.length <= 5}
                >
                  {showAllRejectedPosts
                    ? "Show Less"
                    : "View All Rejected Posts"}
                </motion.button>
              </div>

              {/* Rejected Blogs */}
              <div className=" rounded-lg shadow-xl bg-[#a5a5a511] p-6">
                <h3 className="text-lg font-semibold mb-2">Rejected Blogs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently rejected blogs
                </p>
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                ></motion.ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  ) : (
    <Navigate to="/admin-auth" />
  );
}
