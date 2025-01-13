import React, { useEffect, useState } from "react";
import { Search, Rocket, RocketIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import PostCard from "../components/post-card";
import Footer from "../components/footer";
import ClipLoader from "react-spinners/ClipLoader";
import { GlobeDemo } from "../components/globe";
import BrowseByTags from "../components/browse-by-tags";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    e.preventDefault();
    const newSearch = search;
    queryParams.delete("category");
    queryParams.set("search", newSearch);
    navigate(`/elements?${queryParams.toString()}`);
  };

  const fetchTrendingPosts = () => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/trending-post")
      .then(({ data }) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        // toast.error("something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const handleLinkClick = (path) => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(path);
    }, 500);
  };

  return (
    <div className="relative">
      <main className="flex flex-col items-center justify-center text-center">
        <section className="pt-32 pb-16 text-center px-4 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                Discover & Create
              </span>
              <br />
              <span className="text-white">Beautiful UI Components</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our vast library of open-source UI elements. Copy,
              customize, and create stunning interfaces in minutes.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto relative mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search for components, styles, creators..."
              defaultValue={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchChange(e);
                }
              }}
              className="w-full px-6 py-4 rounded-full focus:bg-white/10 bg-[#161616] border focus:border-white/20 duration-300 border-[#161616] outline-none focus:outline-none transition-all text-white placeholder-gray-400"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </motion.div>

          {/* <div className="w-full h-screen overflow-hidden">
            <GlobeDemo />
          </div> */}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className=" mb-2 text-center w-full max-w-7xl mx-auto border-t-2 shadow-lg rounded-xl border-t-[#2a2a2a]"
        >
          <BrowseByTags />
        </motion.section>

        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Copy & Paste</h3>
              <p className="text-gray-400">
                Ready-to-use components with multiple framework support
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-400">
                Created by developers for developers
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-gray-400">
                Free to use and modify under MIT license
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>
    </div>
  );
}

export default HomePage;
