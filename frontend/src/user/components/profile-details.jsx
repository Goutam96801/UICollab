import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  StickyNote,
  X,
  SquarePen,
  Hourglass,
  SlidersHorizontal,
  ChevronDown,
  Dice5,
  BookMarked,
  Eye,
  CalendarDays,
  SunMoon,
  Sun,
  Moon,
  Clock3,
  Ban,
  FolderCode,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AnimationWrapper from "../../common/page-animation";
import ProfilePostCard from "./profile-post-card";
import { UserContext } from "../../App";
import NoPostCreated from "../../ui/no-post-created";

export default function ProfileDetails({ setProgress }) {
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sort, setSort] = useState("randomized");
  const [theme, setTheme] = useState("any");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const sortButtonRef = useRef(null);
  const themeButtonRef = useRef(null);
  const sortMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

  let userProfile = useParams();

  let {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  const fetchUserPost = async () => {
    setProgress(70);
    setLoading(true);

    await axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/user-post", {
        username: userProfile.id,
        status: activeTab,
        sort,
        theme,
      })
      .then(({ data }) => {
        setPosts(data.posts);
        setProgress(100);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("something went wrong");
        setProgress(100);
        setLoading(false);
      });
  };

  const tabs = [
    { key: "published", label: "Posts", icon: "", color: "" },
    {
      key: "under_review",
      label: "Review",
      icon: "Hourglass",
      color: "yellow-500",
    },
    { key: "rejected", label: "Rejected", icon: "X", color: "red-500" },
    { key: "draft", label: "Drafts", icon: "SquarePen", color: "cyan-500" },
  ];

  const handleClickOutside = (event) => {
    if (
      sortMenuOpen &&
      sortMenuRef.current &&
      !sortMenuRef.current.contains(event.target) &&
      !sortButtonRef.current.contains(event.target)
    ) {
      setSortMenuOpen(false);
    }

    if (
      themeMenuOpen &&
      themeMenuRef.current &&
      !themeMenuRef.current.contains(event.target) &&
      !themeButtonRef.current.contains(event.target)
    ) {
      setThemeMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuOpen, themeMenuOpen]);

  useEffect(() => {
    fetchUserPost();
  }, [theme, sort, activeTab]);

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
    <div>
      <div className="flex-wrap justify-between hidden gap-1 sm:flex">
        <div>
          <nav className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`py-2 px-4 text-center font-medium text-base flex gap-2 rounded-full ${
                activeTab === "published"
                  ? "drop-shadow-sm shadow-sm shadow-teal-400 "
                  : ""
              }`}
              onClick={() => setActiveTab("published")}
            >
              Posts
            </motion.button>
            {userProfile.id === username ? (
              <>
                {" "}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`py-2 px-4 text-center font-medium text-base flex gap-2 rounded-full ${
                    activeTab === "under_review"
                      ? "drop-shadow-sm shadow-sm shadow-teal-400 "
                      : ""
                  }`}
                  onClick={() => setActiveTab("under_review")}
                >
                  <Clock3 width={20} color="yellow" />
                  Review
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`py-2 px-4 text-center font-medium text-base flex gap-2 rounded-full ${
                    activeTab === "rejected"
                      ? "drop-shadow-sm shadow-sm shadow-teal-400 "
                      : ""
                  }`}
                  onClick={() => setActiveTab("rejected")}
                >
                  <Ban width={20} color="red" />
                  Rejected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`py-2 px-4 text-center font-medium text-base flex gap-2 rounded-full ${
                    activeTab === "draft"
                      ? "drop-shadow-sm shadow-sm shadow-teal-400 "
                      : ""
                  }`}
                  onClick={() => setActiveTab("draft")}
                >
                  <FolderCode width={20} color="teal" />
                  Drafts
                </motion.button>
              </>
            ) : (
              ""
            )}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-1 gap-y-2 ">
          {/* Sort */}
          <motion.div
            className="max-w-2xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              ref={sortButtonRef}
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium  hover:bg-[#212121] hover:text-white duration-300 ${
                sortMenuOpen ? "bg-[#212121] text-white " : "text-zinc-400"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 capitalize" />
              Sort:{" "}
              <p className="capitalize">
                {sort === "total_saves"
                  ? "favourite"
                  : sort === "publishedAt"
                  ? "Recent"
                  : sort}
              </p>
              <ChevronDown className="h-4 w-4" />
            </button>
            {sortMenuOpen && (
              <AnimationWrapper transition={0.2}>
                <div
                  ref={sortMenuRef}
                  className="absolute left-0 top-full z-50 mt-1 w-40 rounded-md border border-zinc-800 bg-[#121212] py-1 shadow-lg"
                >
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setSort("randomized");
                      setSortMenuOpen(false); // Close the sort menu
                    }}
                  >
                    <Dice5 width={20} />
                    Randomized
                  </button>
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setSort("total_saves");
                      setSortMenuOpen(false); // Close the sort menu
                    }}
                  >
                    <BookMarked width={20} />
                    Favourites
                  </button>
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setSort("views");
                      setSortMenuOpen(false); // Close the sort menu
                    }}
                  >
                    <Eye width={20} />
                    Views
                  </button>
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setSort("publishedAt");
                      setSortMenuOpen(false); // Close the sort menu
                    }}
                  >
                    <CalendarDays width={20} />
                    Recent
                  </button>
                </div>
              </AnimationWrapper>
            )}
          </motion.div>

          {/* Theme */}
          <motion.div
            className="max-w-lg mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              ref={themeButtonRef}
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className={`flex items-center gap-2 rounded-xl px-2 duration-300 capitalize py-2 text-sm font-medium hover:bg-[#212121] hover:text-white ${
                themeMenuOpen ? "bg-[#212121] text-white " : "text-zinc-400"
              }`}
            >
              <SunMoon className="w-4 h-4" />
              Theme: <p className="capitalize">{theme}</p>
              <ChevronDown className="h-4 w-4 " />
            </button>
            {themeMenuOpen && (
              <AnimationWrapper transition={0.2}>
                <div
                  ref={themeMenuRef}
                  className="absolute left-0 top-full z-50 mt-1 w-40 rounded-md border duration-300 transition-all border-zinc-800 bg-[#121212] py-1 shadow-lg"
                >
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setTheme("light");
                      setThemeMenuOpen(false); // Close the theme menu
                    }}
                  >
                    <Sun width={20} />
                    Light
                  </button>
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setTheme("dark");
                      setThemeMenuOpen(false); // Close the theme menu
                    }}
                  >
                    <Moon width={20} />
                    Dark
                  </button>
                  <button
                    className="w-full flex gap-2 px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                    onClick={() => {
                      setTheme("any");
                      setThemeMenuOpen(false);
                    }}
                  >
                    <SunMoon width={20} />
                    Any Theme
                  </button>
                </div>
              </AnimationWrapper>
            )}
          </motion.div>
        </div>

        {activeTab === "published" && posts.length === 0 ? (
          <NoPostCreated setProgress={setProgress} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-y-5 rounded-md mt-2 ${activeTab !== 'published' && posts.length !== 0 && `border border-gray-600 shadow-md bg-gradient-to-br from-[#212121]`} p-4 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements`}
          >
            {posts.map((item, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
              >
                <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow">
                  <ProfilePostCard key={index} item={item} />
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
