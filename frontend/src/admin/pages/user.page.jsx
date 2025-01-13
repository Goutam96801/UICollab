import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../App";
import { Users, User, MessageSquare, BookOpen, Search, RefreshCwOff } from "lucide-react";
import { motion } from "framer-motion";

function AllUserShown(props) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const fetchAllUser = async () => {
    props.setProgress(70);
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-all-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        props.setProgress(100);
        setUsers(data.user);
      })
      .catch((err) => {
        props.setProgress(100);
        setError(err.response?.data?.error);
      });
  };

  useEffect(() => {
    fetchAllUser();
  }, [access_token]);

  const filteredUsers = users.filter(
    (user) =>
      user.personal_info.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.personal_info.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className=" w-[calc(100vw-250px)] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 overflow-y-auto">
      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0"
        >
          <h1 className=" bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 text-3xl font-bold">
            User Profiles
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full md:w-64 lg:focus:w-96 rounded-full bg-gray-700 border border-gray-600 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 lg:focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-300 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </motion.div>

        {error && (
          <motion.div className="text-center py-10 transition-all duration-300 ease-in-out">
            <RefreshCwOff className="mx-auto text-gray-500" size={48} />
            <p className="mt-4 text-xl text-gray-400">{error}</p>
          </motion.div>
        )}
        {!error && filteredUsers.length === 0 ? (
          <motion.div className="text-center py-10 transition-all duration-300 ease-in-out">
            <Users className="mx-auto text-gray-500" size={48} />
            <p className="mt-4 text-xl text-gray-400">No users found</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1  lg:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredUsers.map((user, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                        <img
                          src={user.personal_info.profile_img}
                          alt={`${user.personal_info.username}'s profile`}
                          className="rounded-full w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-100">
                          {user.personal_info.fullname}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <User size={16} />
                          <span className="text-sm">
                            @{user.personal_info.username}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div className="flex items-center space-x-1">
                        <MessageSquare size={16} className="text-blue-400" />
                        <span className="text-sm font-medium text-gray-300">
                          {user.account_info.total_posts} posts
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen size={16} className="text-green-400" />
                        <span className="text-sm font-medium text-gray-300">
                          {user.account_info.total_blogs} blogs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AllUserShown;
