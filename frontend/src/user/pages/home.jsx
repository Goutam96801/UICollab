import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Rocket,
  RocketIcon,
  Star,
  CodeXml,
  Grid2X2,
  Gift,
  Users,
  Copy,
  Users2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import PostCard from "../components/post-card";
import Footer from "../components/footer";
import ClipLoader from "react-spinners/ClipLoader";
import { GlobeDemo } from "../components/globe";
import BrowseByTags from "../components/browse-by-tags";
import HomePostCard from "../components/home-post-card";
import Loader from "../../ui/loader";

function HomePage(props) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [tailwindLoaded, setTailwindLoaded] = useState(false);
  const [totalPost, setTotalPost] = useState(null);
  const [totalUser, setTotalUser] = useState(null);

  const handleSearchChange = (e) => {
    e.preventDefault();
    const newSearch = search;
    queryParams.delete("category");
    queryParams.set("search", newSearch);
    navigate(`/elements?${queryParams.toString()}`);
  };

  const handleLinkClick = (path) => {
    props.setProgress(70);
    setTimeout(() => {
      props.setProgress(100);
      navigate(path);
    }, 500);
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

  const fetchTotalPostCount = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/explore-post-count")
      .then(({ data }) => {
        console.log(data.totalDocs);
        setTotalPost(data.totalDocs);
      })
      .catch((err) => {
        console.log("Error fetching post count");
      });
  };

  const fetchTotalUser = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/user-count")
      .then(({ data }) => {
        console.log(data.totalDocs);
        setTotalUser(data.totalDocs);
      })
      .catch((err) => {
        console.log("Error fetching post count");
      });
  };

  useEffect(() => {
    fetchTotalUser();
    fetchTrendingPosts();
    fetchTotalPostCount();
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      if (!shadowRootRef.current) {
        shadowRootRef.current = previewRef.current.attachShadow({
          mode: "open",
        });
      }
      const shadowRoot = shadowRootRef.current;

      // Add Tailwind CSS if the post uses it
      const tailwindCDN = posts.tailwindCSS
        ? "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        : "";

      // Create a new link element for Tailwind CSS
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = tailwindCDN;

      // Create a new style element for custom CSS
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        ${posts.cssCode}
      `;

      // Create a div for the HTML content
      const contentDiv = document.createElement("div");
      contentDiv.innerHTML = posts.htmlCode;

      // Clear previous content and append new elements
      shadowRoot.innerHTML = "";
      if (posts.tailwindCSS) {
        shadowRoot.appendChild(linkElement);
      }
      shadowRoot.appendChild(styleElement);
      shadowRoot.appendChild(contentDiv);

      shadowRoot.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      // Ensure Tailwind styles are applied after the stylesheet is loaded
      if (posts.tailwindCSS) {
        linkElement.onload = () => {
          contentDiv.classList.add("tailwind");
          setTailwindLoaded(true);
        };
      } else {
        setTailwindLoaded(true);
      }
    }
  }, [posts]);

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
            className="max-w-2xl mx-auto relative"
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
        </section>

        {/* Browse all elements */}

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center gap-2 grid max-xs:grid-cols-1 grid-cols-home p-1 mx-auto shadow-lg rounded-xl border-[#2a2a2a] mb-4"
        >
          {loading ? (
            <div className="col-span-5 flex justify-center items-center h-64">
              <Loader size={50} />
            </div>
          ) : (
            posts.map((post, index) => (
              <HomePostCard
                post={post}
                index={index}
                setProgress={props.setProgress}
              />
            ))
          )}
          <div className="col-span-5 flex justify-center">
            <button
              className={`${
                loading ? "hidden" : "block"
              } w-full max-w-xs px-4 py-2 bg-gradient-to-r rounded-full items-center justify-center mx-auto from-purple-400 to-teal-400 font-bold text-xl text-center`}
              onClick={() => handleLinkClick("/elements")}
            >
              Explore all elements
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className=" text-center w-full max-w-7xl  mx-auto border-2 shadow-lg rounded-xl border-[#2a2a2a] mb-6"
        >
          <BrowseByTags />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className=" py-24 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {/* UI Elements Stat */}
              <div className="space-y-4">
                <Grid2X2 className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-5xl font-bold tracking-tighter text-white">
                  {totalPost}
                </p>
                <p className="text-lg text-gray-400">
                  Community-made UI elements
                </p>
              </div>

              {/* License Stat */}
              <div className="space-y-4">
                <Gift className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-5xl font-bold tracking-tighter text-white">
                  100%
                </p>
                <p className="text-lg text-gray-400">
                  Free for personal and
                  <br />
                  commercial use
                </p>
              </div>

              {/* Contributors Stat */}
              <div className="space-y-4">
                <Users className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-5xl font-bold tracking-tighter text-white">
                  {totalUser}
                </p>
                <p className="text-lg text-gray-400">
                  Contributors to the
                  <br />
                  community
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className=" text-center w-full max-w-7xl p-1 mx-auto border-2 shadow-lg rounded-3xl border-[#2a2a2a] mb-4 flex"
        >
          <div className="w-full min-h-[200px] max-h-[calc(100vh-100px)] overflow-hidden lg:w-[calc(100vw-380px)] hidden lg:flex">
            {/* <GlobeDemo /> */}
          </div>
          <div className="min-h-[200px] py-8 bg-dark-800 border-[#212121]/80 bg-gradient-to-tl from-[#111] border-2 px-14 content-center lg:w-[380px] flex sm:justify-between gap-4 flex-wrap justify-center relative overflow-hidden rounded-3xl items-center">
            <div className="relative z-10 flex flex-wrap items-center gap-5">
              <img
                src="/github-mark-white.svg"
                alt=""
                className="block mx-auto"
              />
              <div>
                <h2 className="mb-1 text-xl font-bold sm:text-3xl font-display">
                  UICollab{" "}
                  <span className="inline-block text-transparent bg-gradient-to-br from-indigo-500 via-fuchisa-500 to-fuchsia-400 bg-clip-text">
                    Universe
                  </span>
                </h2>
                <p className="text-lg text-gray-400">
                  The vast library of open-source UI elements, available on
                  GitHub!
                </p>
                <Link
                  className="font-mono text-sm text-gray-500 underline underline-offset-2"
                  to="https://github.com/uicollab/universe"
                  target="_blank"
                >
                  uicollab/uinverse
                </Link>
              </div>
            </div>
            <Link
              className="px-4 py-2.5 flex items-center justify-center text-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 bg-[#212121] hover:bg-[#2b2b2b] text-offwhite cursor-pointer relative left-12 z-[1]"
              to="https://github.com/uicollab/universe"
              target="_blank"
            >
              <Star color="yellow" size={20} />
              Star on GitHub
            </Link>
          </div>
        </motion.section>

        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            ><Copy className="w-12 h-12 mx-auto text-gray-400" />
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
              <Users2 className="w-12 h-12 mx-auto text-gray-400" />
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
              <img src="/icons8-open-source.svg" alt="" className="w-12 h-12 mx-auto text-gray-400"/>
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
