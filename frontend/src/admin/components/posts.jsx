import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../App";
import {
  Ban,
  CheckCheck,
  Cross,
  Loader,
  Loader2,
  RefreshCwOff,
  WrenchIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminPostCard from "./post-card";
import { motion } from "framer-motion";

export default function AdminPost(props) {
  let {
    adminAuth, 
    adminAuth: { access_token },
  } = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState("under_review");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  const fetchPosts = () => {
    if (!access_token) return;
    props.setProgress(70);
    setLoading(true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/posts",
        { status: activeTab },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        props.setProgress(100);
        setLoading(false);
        setPosts(data);
      })
      .catch((err) => {
        props.setProgress(100);
        setLoading(false);
        setError(err.response?.data?.error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [access_token, activeTab]);

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

  return (
    <>
      <div className="w-[calc(100vw-250px)] bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="sticky top-0 z-10 ">
          <nav className="flex gap-1">
            <motion.button
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`py-2 px-4 text-center text-yellow-500 font-medium text-base flex gap-2 rounded ${
                activeTab === "under_review"
                  ? "bg-gray-800"
                  : ""
              }`}
              onClick={() => setActiveTab("under_review")}
            >
              <Loader />
              Under Review
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`py-2 px-4 text-center text-green-500 font-medium text-base rounded flex gap-2  ${
                activeTab === "published" ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveTab("published")}
            >
              <CheckCheck />
              Published Posts
            </motion.button>
            <motion.button whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`py-2 px-4 text-center text-red-500 font-medium text-base rounded flex gap-2 ${
                activeTab === "rejected" ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              <Ban />
              Rejected Posts
            </motion.button>
          </nav>
        </div>

        {error && (
          <motion.div className="text-center py-10 transition-all duration-300 ease-in-out">
            <RefreshCwOff className="mx-auto text-gray-500" size={48} />
            <p className="mt-4 text-xl text-gray-400">{error}</p>
          </motion.div>
        )}
        <div className="mt-4 overflow-y-auto h-[100vh]">
          {activeTab === "under_review" ||
          activeTab === "published" ||
          activeTab === "rejected" ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements"
            >
              {!error && posts.length === 0 && <p>Content not available</p>}
              {posts.map((item, index) => (
                <motion.article
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
                >
                  <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow">
                    <AdminPostCard key={index} item={item} setProgress={props.setProgress} />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
}
