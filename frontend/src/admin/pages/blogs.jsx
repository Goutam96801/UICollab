import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../App";
import {
  Ban,
  CheckCheck,
  Cross,
  Loader,
  Loader2,
  Pickaxe,
  RefreshCwOff,
  WrenchIcon,
} from "lucide-react";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import "../../utils/editor.css";
import AdminBlogCard from "../components/blog-card";

export default function Blogs(props) {
  let {
    adminAuth, 
    adminAuth: { access_token },
  } = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState("published");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  const fetchBlogs = () => {
    if (!access_token) return;
    props.setProgress(70);
    setLoading(true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin-blogs",
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
        setBlogs(data);
      })
      .catch((err) => {
        props.setProgress(100);
        setLoading(false);
        setError(err.response?.data?.error);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, [access_token, activeTab]);

  // console.log(blogs);
  // console.log(blogs.content)



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
      <div className="w-[calc(100vw-250px)] bg-gradient-to-br  from-gray-900 to-gray-800 px-8 pt-8">
        <div className=" z-10 ">
          <nav className="flex gap-1 sticky top-0 overflow-hidden">
            
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
              Published
            </motion.button>
            <motion.button whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`py-2 px-4 text-center text-yellow-500 font-medium text-base rounded flex gap-2 ${
                activeTab === "draft" ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveTab("draft")}
            >
            <Pickaxe />
              Drafts
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
          {
          activeTab === "published" ||
          activeTab === "draft" ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements"
            >
              {!error && blogs.length === 0 && <p>Content not available</p>}
              {blogs.map((item, index) => (
                <AdminBlogCard blog={item}/>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
}
