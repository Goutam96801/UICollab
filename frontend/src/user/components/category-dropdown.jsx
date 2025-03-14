import React, { useEffect, useState } from "react";
import AnimationWrapper from "../../common/page-animation";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import SocialCard from "./social_card";
import axios from "axios";
import * as LucidIcons from "lucide-react";
import Loader from "../../ui/loader";

function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-categories"
      );

      const updatedCategories = [
        { name: "All", icon: "List", post: [] },
        ...data.category,
        { name: "My Favourites", icon: "BookMarked", post: [] },
      ];
      setLoading(false);
      setCategories(updatedCategories);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching categories:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const getIconComponent = (name) => {
    const IconComponent = LucidIcons[name];
    return <IconComponent size={20} />;
  };

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
    <AnimationWrapper transition={0.3} className="absolute top-10 z-50">
      <div className="z-50 mt-2 duration-300 bg-[#171717] p-3 border-[#2a2a2a] border-2 rounded-2xl w-[720px] flex justify-between">
        <motion.div
          className="w-2/3 flex gap-2 flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading && (
            <div className="block mx-auto my-auto">
              <Loader size={50} />
            </div>
          )}
          {categories.map(({ name, icon, post }, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                onClick={(e) => e.stopPropagation()}
                to={name === "All" ? "/elements" : `/${name.toLowerCase()}`}
                className="w-56 rounded-md flex flex-row justify-between gap-2 items-center cursor-pointer transition-all duration-300 bg-[#212121] hover:border-gray-200 border-[#a5a5a511] p-2"
              >
                <div className="flex gap-2 text-[#a0a0a0]">
                  {getIconComponent(icon)}
                  <span className="capitalize flex items-center text-center  font-semibold">
                    {name}
                  </span>
                </div>
                <span className="text-sm text-white/50 text-center flex justify-center items-center">
                  {post?.length === 0
                    ? ""
                    : post?.length ?? <ClipLoader color="#983fa5" size={15} />}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="">
          <SocialCard />
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default CategoryDropdown;
