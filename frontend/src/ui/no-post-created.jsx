import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserContext } from "../App";

function NoPostCreated({ setProgress }) {
  const navigate = useNavigate();
  let userProfile = useParams();
  let {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  const handleLinkClick = (path) => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(path);
    }, 500);
  };
  return (
    <div className="w-full border rounded-md border-gray-600 shadow-md bg-gradient-to-br from-[#212121] mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 "
          >
            <svg
              className="w-24 h-24 text-teal-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold mb-4  bg-clip-text text-transparent bg-gradient-to-bl from-purple-400 to-teal-400"
          >
            No Public Posts Yet
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg bg-clip-text text-transparent bg-gradient-to-tr from-purple-400 to-teal-400 text-center mb-6 max-w-md"
          >
            {userProfile.id === username
              ? "Your space is waiting for your ideas. Hit 'Create' to make it yours!"
              : "This user does not have any public post"}
          </motion.p>

          {userProfile.id === username ? (
            <motion.button
              onClick={() => {
                handleLinkClick("/create");
              }}
              className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-purple-400 to-teal-400 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span className="mr-2 font-semibold">Create</motion.span>

              <Plus size={20} />
            </motion.button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default NoPostCreated;
