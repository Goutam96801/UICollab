import {
  BadgeX,
  Ban,
  Bookmark,
  BookMarked,
  Calendar,
  CalendarDays,
  Check,
  CheckIcon,
  ChevronDown,
  Clipboard,
  Delete,
  DeleteIcon,
  Moon,
  MoveLeft,
  RefreshCcw,
  Rocket,
  Scale,
  ShieldAlert,
  Sun,
  Trash2,
  UserRound,
} from "lucide-react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../App";
import Sidebar from "../components/sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { getDay, getFullDay } from "../../common/date";
import Comments from "../components/comments";
import ReportModal from "../components/report-modal";
import Footer from "../components/footer";
import { Preview } from "../components/preview";
import { EditorTabs } from "../components/editor-tabs";
import UserAuthentication from "../components/user-authentication";
import { motion } from "framer-motion";
import PostSubmitAlert from "../components/post-submit-alert";
import CodeConverter from "../components/export-code";

export const postDataStructure = {
  _id: "",
  category: "",
  title: "",
  createdAt: "",
  cssCode: "",
  tailwindCss: false,
  theme: "",
  htmlCode: "",
  postId: "",
  activity: {},
  status: "",
  tags: [],
  publishedAt: "",
  backgroundColor: "",
  author: { personal_info: {} },
};

function PostDetails(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(postDataStructure);
  const [backgroundColor, setBackgroundColor] = useState("#e8e8e8");
  const [activeTab, setActiveTab] = useState("html");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const editorRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [exportReactOpen, setExportReactOpen] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const exportBtnRef = useRef();
  const exportRef = useRef();
  const [exportModal, setExportModal] = useState("");
  let { postId } = useParams();

  let {
    userAuth: { access_token, username: loggedUsername },
  } = useContext(UserContext);

  let {
    _id,
    category,
    title,
    htmlCode,
    tailwindCss,
    backgroundColor: bgColor,
    cssCode,
    activity: {
      total_views,
      total_saves,
      total_comments,
      total_parent_comments,
    },
    theme,
    status,
    tags,
    author: {
      personal_info: { username, profile_img, fullname },
    },
    publishedAt,
  } = post;

  useEffect(() => {
    bgColor ? setBackgroundColor(bgColor) : setBackgroundColor("#e8e8e8");
  }, []);

  const fetchPostDetails = () => {
    setLoading(true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-post",
        { postId: postId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setPost(data.result);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.error || "Something went wrong!");
        setLoading(false);
      });
  };

  const fetchLoggedUser = async () => {
    if (access_token) {
      await axios
        .get(process.env.REACT_APP_SERVER_DOMAIN + "/logged-user", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          toast.error(err.response.data.error || "Something went wrong.");
        });
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, [access_token]);

  useEffect(() => {
    if (user && Array.isArray(user.saved_post)) {
      setIsSaved(user.saved_post.includes(post._id));
    }
  }, [post._id, user]);

  const toggleSave = async () => {
    if (!user) {
      setShowLoginModal(true);
    }
    setLoading(true);
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/toggle-save-post",
        { postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        setIsSaved(response.data.isSaved);
        post.saved = response.data.isSaved ? post.saved + 1 : post.saved - 1;
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error while saving post");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const [isDarkMode, setIsDarkMode] = useState(theme == "dark");

  const handleGoBack = () => {
    props.setProgress(70);
    setTimeout(() => {
      props.setProgress(100);
      navigate(-1);
    }, 500);
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setBackgroundColor("#e8e8e8");
      setIsDarkMode(false);
    } else {
      setBackgroundColor("#212121");
      setIsDarkMode(true);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const copyToClipboard = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard
        .writeText(code)
        .then(() => setCopied(true))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      copyWithSyntaxHighlighting: true,
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 10,
        alwaysConsumeMouseWheel: false,
      },
      fontSize: 14,
      wordWrap: "on",
      autoClosingBrackets: "always",
      autoIndent: true,
      autoClosingQuotes: "always",
      autoClosingComments: "always",
    }),
    []
  );

  useEffect(() => {
    setCopied(false);
  }, [activeTab]);

  const handleCloseBtn = () => {
    setReportModal(false);
  };

  const handleLoginCloseBtn = () => {
    setShowLoginModal(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/delete-post",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      toast.success("Post deleted successfully");
      navigate(`/profile/${loggedUsername}`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Error deleting post");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setProgress(70);
    e.target.classList.add("disabled");

    setTimeout(() => {
      setSubmitModal(!submitModal);
      e.target.classList.remove("disabled");
      props.setProgress(100);
    }, 500);
  };

  const handleClickOutside = (event) => {
    if (
      exportReactOpen &&
      exportBtnRef.current &&
      exportRef.current &&
      !exportRef.current.contains(event.target) &&
      !exportBtnRef.current.contains(event.target) // Ensure button clicks are excluded
    ) {
      setExportReactOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportReactOpen]);

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <div className="h-full flex rounded-b-3xl relative max-w-[2200px] m-auto mb-10 px-[20px] w-full overflow-clip shadow-b-lg">
        {/* Sidebar */}
        <div className="z-0 h-[calc(100vh_-_60px)] mr-4 sticky top-0 pt-2 pb-4 hidden xl:block">
          <div className="w-[200px] flex flex-col h-full">
            <Sidebar />
          </div>
        </div>

        <main className="w-full h-full">
          <div className="flex justify-between items-center px-4 py-1">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 hover:bg-[#212121] p-2 rounded-full duration-300"
            >
              {" "}
              <MoveLeft width={25} />
              Go back
            </button>
            {status === "published" ? (
              <div className="flex items-center space-x-1 text-base font-medium text-gray-400">
                <h1 className="capitalize text-nowrap">{category}</h1>
                <p>by</p>
                <Link
                  to={`/profile/${username}`}
                  className=" hover:text-gray-200 px-4 pl-3 py-2 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-full text-gray-300 duration-300 hover:bg-[#a5a5a511]"
                >
                  <img
                    src={profile_img}
                    alt={username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="whitespace-nowrap">{username}</span>
                </Link>
              </div>
            ) : status === "draft" ? (
              <p className="px-2 py-0.5 font-semibold text-sm text-teal-500 bg-teal-400/10 rounded-full">
                Draft
              </p>
            ) : status === "rejected" ? (
              <p className="px-2 py-0.5 font-semibold text-sm text-red-500 bg-red-400/10 rounded-full">
                Rejected
              </p>
            ) : (
              <p className="px-2 py-0.5 font-semibold text-sm text-yellow-500 bg-yellow-400/10 rounded-full">
                Under Review
              </p>
            )}
          </div>
          <div className="min-h-[calc(100vh-10rem)] w-full px-4">
            <div className="flex flex-col-reverse md:flex-row bg-[#28282811]">
              <Preview
                backgroundColor={backgroundColor}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                htmlCode={htmlCode}
                cssCode={cssCode}
                useTailwind={tailwindCss}
                setBackgroundColor={setBackgroundColor}
              />

              <div className="w-full h-[calc(100vh-10rem)] md:w-1/2 pl-2">
                <EditorTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  useTailwind={tailwindCss}
                />
                <div className="w-full h-[calc(100vh-12.3rem)] border relative border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
                  <MonacoEditor
                    height="100%"
                    language={activeTab}
                    theme="vs-dark"
                    value={activeTab === "html" ? htmlCode : cssCode}
                    options={editorOptions}
                    onMount={handleEditorDidMount}
                  />
                  <button
                    onClick={copyToClipboard}
                    className=" flex gap-1 items-center absolute top-1 right-3  py-0.5 text-sm w-[78px] justify-center rounded text-center bg-[#232323]/70 font-semibold"
                  >
                    <Clipboard width={15} />
                    {copied ? (
                      <CheckIcon width={15} className="text-teal-400" />
                    ) : (
                      "Copy"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="items-stretch mt-2 py-2 px-6 col-span-full bg-[#212121] rounded-xl md:block">
              {status === "published" && (
                <div className="flex flex-col items-center md:flex-row justify-between gap-2 h-full flex-wrap min-h-[35px]">
                  <div className="text-base flex items-center gap-4 text-center text-gray-400">
                    <h1>{total_views} views</h1>
                    <button
                      className="flex hover:bg-dark-500 bg-transparent p-2 text-sm gap-2 text-gray-300 cursor-pointer transition-colors  font-sans font-semibold border-none items-center overflow-hidden rounded-md hover:bg-[#303030]"
                      onClick={toggleSave}
                    >
                      {loading ? (
                        <ClipLoader size={20} />
                      ) : isSaved ? (
                        <BookMarked size={20} className="text-yellow-500" />
                      ) : (
                        <Bookmark size={20} />
                      )}
                      {post.activity.total_saves}{" "}
                      <p className={`text-base ${isSaved ? "hidden" : ""}`}>
                        Save to favourites
                      </p>
                    </button>

                    {/* Export  */}
                    <div>
                      <motion.nav
                        initial={false}
                        animate={exportReactOpen ? "open" : "closed"}
                        className="relative "
                      >
                        <motion.button
                          className={`flex items-center bg-[#212121] hover:bg-[#2a2a2a] transition-colors h-[42px] py-0 px-1 rounded-full pl-3 font-semibold ${
                            exportReactOpen && "bg-[#2a2a2a]"
                          }`}
                          whileTap={{ scale: 0.97 }}
                          ref={exportBtnRef}
                        >
                          <div
                            className="flex items-center gap-2 text-sm font-semibold"
                            onClick={() => setExportModal("react")}
                          >
                            <img
                              src="/logo192.png"
                              alt=""
                              className="object-cover rounded-full w-6 h-6"
                            />
                            Export to React
                          </div>
                          <motion.div
                            variants={{
                              open: { rotate: 180 },
                              closed: { rotate: 0 },
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ originY: 0.5 }}
                            onClick={() => setExportReactOpen(!exportReactOpen)}
                            className="hover:bg-[#3a3a3a] rounded-full "
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </motion.button>
                        {exportModal && (
                        <CodeConverter
                          postData={post}
                          exportModal={exportModal}
                          setExportModal={setExportModal}
                        />
                      )}
                        <motion.ul
                          ref={exportRef}
                          className="rounded-lg absolute top-[45px] -right-2 z-50 p-1 shadow-xl bg-[#212121] border-2 border-[#212121] transition-all duration-500 translate-y-[5px]"
                          variants={{
                            open: {
                              clipPath: "inset(0% 0% 0% 0% round 10px)",
                              transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.7,
                                delayChildren: 0.3,
                                staggerChildren: 0.05,
                              },
                            },
                            closed: {
                              clipPath: "inset(10% 50% 90% 50% round 10px)",
                              transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3,
                              },
                            },
                          }}
                          style={{
                            pointerEvents: exportReactOpen ? "auto" : "none",
                          }}
                        >
                          <motion.li
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                          >
                            <button
                              className="hover:text-gray-100 px-5 pl-3 py-2.5 flex gap-2 items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                              onClick={() => setExportModal("react")}
                            >
                              <img
                                src="/logo192.png"
                                alt=""
                                className="object-cover rounded-full w-6 h-6"
                              />
                              <span className="whitespace-nowrap">React</span>
                            </button>
                          </motion.li>
                          <motion.li
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                          >
                            <button
                              className="hover:text-gray-100 px-5 pl-3 py-2.5 flex gap-2 items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                              onClick={() => setExportModal("svelte")}
                            >
                              <img
                                src="/svelte.svg"
                                alt=""
                                className="object-cover rounded-full w-6 h-6"
                              />
                              <span className="whitespace-nowrap">Svelte</span>
                            </button>
                          </motion.li>
                          <motion.li
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                          >
                            <button
                              className="hover:text-gray-100 px-5 pl-3 py-2.5 flex gap-2 items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                              onClick={() => setExportModal("vue")}
                            >
                              <img
                                src="/vue-vuejs.svg"
                                alt=""
                                className="object-cover rounded-full w-6 h-6"
                              />
                              <span className="whitespace-nowrap">Vue</span>
                            </button>
                          </motion.li>
                          <motion.li
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                          >
                            <button
                              className="hover:text-gray-100 px-5 pl-3 py-2.5 flex gap-2 items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                              onClick={() => setExportModal("angular")}
                            >
                              <img
                                src="/angular-com.svg"
                                alt=""
                                className="object-cover rounded-full w-6 h-6"
                              />
                              <span className="whitespace-nowrap">Angular</span>
                            </button>
                          </motion.li>
                          <motion.li
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                          >
                            <button
                              className="hover:text-gray-100 px-5 pl-3 py-2.5 flex gap-2 items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                              onClick={() => setExportModal("lit")}
                            >
                              <img
                                src="/lit-lits.svg"
                                alt=""
                                className="object-cover rounded-full w-6 h-6"
                              />
                              <span className="whitespace-nowrap">Lit</span>
                            </button>
                          </motion.li>
                        </motion.ul>
                      </motion.nav>

                     
                    </div>
                  </div>
                </div>
              )}
              {username === loggedUsername && (
                <div className="flex flex-col items-center md:flex-row justify-between gap-2 h-full flex-wrap min-h-[35px]">
                  {/* delete btn */}
                  <button
                    onClick={handleDelete}
                    className="group relative flex py-2  flex-col px-4 items-center justify-center overflow-hidden rounded-full hover:bg-[#2a2a2a] transition-all duration-300"
                  >
                    {deleting ? (
                      // Spinner Animation SVG
                      <svg
                        viewBox="0 0 24 24"
                        className="animate-spin h-6 w-6 text-red-500"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Trash2 className="h-6 w-6 text-red-500 transition-all duration-300" />
                          <span className=" text-red-500 font-bold scale-0  group-hover:scale-100 transition-all duration-300">
                            Delete
                          </span>
                        </div>
                      </>
                    )}
                  </button>
                  {post.status !== "published" && (
                    <div className="text-base flex gap-4 text-gray-400">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        className="px-4 py-2 font-semibold justify-e rounded-full bg-clip-text text-transparent bg-gradient-to-tr from-purple-400 to-teal-400 flex gap-2"
                      >
                        <RefreshCcw width={20} color="teal" /> Update
                      </motion.button>
                      <motion.button
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        className="px-4 py-2 text-[#e8e8e8] font-semibold  rounded-full bg-gradient-to-tr from-purple-400 to-teal-400 flex gap-2"
                      >
                        <Rocket width={20} /> Submit for review
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 mt-10 px-4 mb-4">
            <div>
              <Comments post={post} />
              <div className="lg:max-w-2xl max-w-[70%] md:max-w-full mt-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Scale width={25} />
                    MIT License
                  </span>
                </div>
                <textarea
                  name=""
                  id=""
                  cols="10"
                  rows="8"
                  className="w-full px-6 pt-6 pb-1 text-base text-gray-300 border-none resize-none bg-[#212121] rounded-xl"
                  readOnly
                  value={`Copyright - 2025 ${post.author.personal_info.fullname} (${post.author.personal_info.username}) \n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}
                />
              </div>
            </div>

            <div>
              <aside>
                <div className="">
                  <h2
                    className="mb-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                   from-purple-400 to-teal-400  font-display capitalize max-w-[300px]"
                  >
                    {category}
                  </h2>
                  <p className="mb-2 text-lg text-gray-100 font-semibold font-display capitalize max-w-[300px]">
                    {title}
                  </p>
                  <div className="flex flex-wrap gap-y-0 gap-x-2 text-gray-300 max-w-[300px]">
                    {tags.map((tag, index) => (
                      <a
                        key={index}
                        className="hover:underline underline-offset-2 text-blue-400"
                        data-discover="true"
                        href="/tags/gradient"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2"></div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-3 font-normal text-gray-400">
                      <CalendarDays />
                      {getFullDay(publishedAt)}
                    </div>
                    <button
                      onClick={() => setReportModal(true)}
                      className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 bg-transparent hover:bg-[#212121] max-md:bg-[#212121] text-offwhite cursor-pointer group"
                    >
                      <ShieldAlert className="text-red-500" />
                      <span className="text-gray-400 group-hover:text-gray-200">
                        Report
                      </span>
                    </button>
                  </div>
                  <div className="w-full h-[2px] bg-dark-500 mb-6 mt-4"></div>
                </div>
                <section className="rounded-xl md:pr-8 max-w-full md:w-[300px] xl:w-[350px] mb-6">
                  <div className="grid grid-cols-[48px_1fr] gap-4 content-start">
                    <Link
                      to={`/profile/${username}`}
                      className=""
                      data-discover="true"
                    >
                      <img
                        src={profile_img}
                        alt={username}
                        className="w-12 h-12 rounded-lg"
                      />
                    </Link>
                    <div className="max-w-full overflow-hidden">
                      <Link
                        className="block text-xl font-semibold text-gray-200 truncate overflow-hidden"
                        data-discover="true"
                        to={`/profile/${username}`}
                      >
                        {username}
                      </Link>
                      <p className="block text-gray-400">{fullname}</p>
                    </div>
                    <p className="block text-gray-200 col-span-full text-base"></p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
        </div>
      </div>

      {reportModal && access_token && (
        <ReportModal
          postId={postId}
          access_token={access_token}
          handleCloseBtn={handleCloseBtn}
        />
      )}
      {showLoginModal && (
        <UserAuthentication handleCloseBtn={handleLoginCloseBtn} />
      )}

      {submitModal && (
        <PostSubmitAlert
          postData={post}
          setProgress={props.setProgress}
          setOpenModal={setSubmitModal}
        />
      )}

      <Footer />
    </AnimationWrapper>
  );
}

export default PostDetails;
