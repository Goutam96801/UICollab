import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as LucidIcons from "lucide-react";
import axios from "axios";
import Loader from "../../ui/loader";

function PostCategory({ onContinue }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [useTailwind, setUseTailwind] = useState(false);
  const navigate = useNavigate();

  const getIconComponent = (name) => {
    // Dynamically find the component from imported icons
    const IconComponent = LucidIcons[name];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-categories"
      );
      setCategories(data.category); // Save the categories in state
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOnChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      onContinue(selectedCategory, useTailwind);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#212121] rounded-lg p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-200">
            What are you making?
          </h3>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={handleClose}
          >
            {getIconComponent("X")}
          </button>
        </div>
        {
          categories.length === 0
          && <Loader size={50}/>
        }
        <div className="grid grid-cols-3 gap-4 mb-6">
          {categories.map(({ name, icon }, index) => (
            <label
              key={index}
              className={`p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                selectedCategory === name
                  ? "bg-gradient-to-r from-purple-400 to-teal-400 text-gray-100 font-semibold text-lg duration-300 transition-all"
                  : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={name}
                onChange={handleOnChange}
                className="hidden"
              />
              {getIconComponent(icon)}
              <span className="capitalize text-sm">{name}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={useTailwind}
                onChange={(e) => setUseTailwind(e.target.checked)}
              />
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  useTailwind
                    ? " bg-gradient-to-r from-purple-400 to-teal-400"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    useTailwind ? "translate-x-4" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <span
                className={`ml-2 text-base text-gray-300 flex gap-1 items-center ${
                  useTailwind
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400"
                    : "translate-x-0"
                }`}
              >
                Tailwind CSS
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 54 33"
                  className="w-5 h-5"
                >
                  <g clipPath="url(#prefix__clip0)">
                    <path
                      fill="#38bdf8"
                      fillRule="evenodd"
                      d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                      clipRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0">
                      <path fill="#fff" d="M0 0h54v32.4H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </label>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={handleContinue}
            disabled={!selectedCategory}
            className={`px-4 py-2 border-[#2a2a2a] border-2  bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 rounded-lg font-semibold transition-colors duration-200 ${
              !selectedCategory ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default PostCategory;
