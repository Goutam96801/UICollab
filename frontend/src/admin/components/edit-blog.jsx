import { useState, useRef, useEffect, useCallback, useContext } from "react";
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
import {
  Eye,
  Send,
  Settings,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  ChevronDown,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Text,
  Ellipsis,
  ListOrdered,
  List,
  Save,
} from "lucide-react";

import Dropcursor from "@tiptap/extension-dropcursor";
import ImageResize from "tiptap-extension-resize-image";
import "../../utils/editor.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AdminContext } from "../../App";
import AnimationWrapper from "../../common/page-animation";
import ImageUploader from "./image-uploader";
import BlogPreview from "./blog-preview";

export default function BlogEditor(props) {
  const { blogId } = useParams();
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [blog, setBlog] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [content, setContent] = useState("");
  const [sourceCreator, setSourceCreator] = useState("");
  const [style, setStyle] = useState("paragraph");
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const alignButtonRef = useRef(null);
  const alignMenuRef = useRef(null);
  const styleButtonRef = useRef(null);
  const styleMenuRef = useRef(null);
  const saveButtonRef = useRef(null);
  const saveMenuRef = useRef(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [align, setAlign] = useState("left");
  const [alignModal, setAlignModal] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  let {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const fetchBlog = useCallback (async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin-get-blog",
        { blogId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setTitle(response?.data.title);
      setLabel(response?.data.label);
      setSelectedOption(response?.data.isOriginal ? "yes" : "no");
      setSourceLink(response?.data.sourceLink);
      setSourceCreator(response?.data.sourceCreator);
      setContent(response?.data.content);
      setBlog(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [access_token, blogId])

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      ImageResize,
      Dropcursor,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      Underline,
      TextStyle,
      Highlight,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert min-h-[200px] p-4 focus:outline-none max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const addImage = useCallback(() => {
    setShowImageUploader(true);
  }, []);

  const handleImageUpload = useCallback(
    (imageUrl) => {
      if (editor && imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      setShowImageUploader(false);
    },
    [editor]
  );

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (
      saveModal &&
      saveMenuRef.current &&
      !saveMenuRef.current.contains(event.target) &&
      !saveButtonRef.current.contains(event.target)
    ) {
      setSaveModal(false);
    }

    if (
      styleMenuOpen &&
      styleMenuRef.current &&
      !styleMenuRef.current.contains(event.target) &&
      !styleButtonRef.current.contains(event.target)
    ) {
      setStyleMenuOpen(false);
    }

    if (
      alignModal &&
      alignMenuRef.current &&
      !alignMenuRef.current.contains(event.target) &&
      !alignButtonRef.current.contains(event.target)
    ) {
      setAlignModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [styleMenuOpen, alignModal, saveModal]);

  const applyStyle = (item) => {
    setStyle(item);
    setStyleMenuOpen(false);

    if (editor) {
      editor.chain().focus();

      if (item === "paragraph") {
        editor.chain().setParagraph().run();
      } else {
        const level = Number.parseInt(item.slice(1));
        editor.chain().toggleHeading({ level }).run();
      }
    }
  };

  const saveBlog = async (status) => {

    if(selectedOption==='no' && !sourceLink){
        return toast.error("Source link is required.")
    }
    props.setProgress(70);
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/create-blog",
        {
          id: blogId,
          title,
          banner: "/example.jpg",
          content: editor.getJSON(),
          label,
          isOriginal: selectedOption === "yes",
          sourceLink,
          sourceCreator,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        props.setProgress(100);
        const toastMessage =
          status === "draft" ? "Changes saved" : "Blog published👍";
        toast.success(toastMessage);
      } else {
        props.setProgress(100);
        toast.error("Something went wrong");
      }
    } catch (error) {
      props.setProgress(100);
      toast.error("Something went wrong", error);
    }
  };

  const handleCloseBtn = () => {
    setPreviewOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="md:w-[calc(100vw-250px)] w-full bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 overflow-y-auto max-h-screen">
      <Toaster />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4">
        <div className="p-4">
          <div className=" relative flex items-center w-full text-2xl">
            <input
              type="text"
              className="peer text-2xl border-gray-700 py-1 border-b-2 focus:border-gray-800 transition-colors focus:outline-none peer bg-inherit w-full peer bg-gray-900 outline-none px-4  rounded-lg border-l border-r focus:shadow-md"
              defaultValue={title}
              name="title"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              htmlFor="title"
              className="absolute left-0 top-1 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-[#e8e8e8] font-semibold translate-y-[-50%] peer-focus:bg-transparent  opacity-70 peer-focus:left-3 text-base  peer-valid:-top-4 peer-valid:left-3 peer-valid:text-sm  duration-150"
            >
              Title
              <span className="text-base text-red-500 absolute top-0 ">*</span>
            </label>
          </div>

          <div className="border-b border-gray-600 p-2 flex gap-2 flex-wrap">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              aria-label="bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("bold") ? "bg-gray-700" : ""
              }`}
            >
              <Bold size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("italic") ? "bg-gray-700" : ""
              }`}
            >
              <Italic size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("underline") ? "bg-gray-700" : ""
              }`}
            >
              <UnderlineIcon size={20} />
            </motion.button>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                ref={alignButtonRef}
                className={`flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium ${
                  alignModal ? "bg-gray-700" : ""
                }`}
                onClick={() => setAlignModal(!alignModal)}
              >
                {align === "left" ? (
                  <AlignLeft size={20} />
                ) : align === "center" ? (
                  <AlignCenter size={20} />
                ) : align === "right" ? (
                  <AlignRight size={20} />
                ) : (
                  <AlignJustify size={20} />
                )}
                <ChevronDown size={15} />
              </button>
              {alignModal && (
                <div
                  ref={alignMenuRef}
                  className="absolute left-0 top-full z-50 mt-1 w-36 rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg"
                >
                  {["left", "center", "right", "justify"].map((item) => (
                    <button
                      key={item}
                      className="capitalize flex gap-2 items-center w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => {
                        editor?.chain().focus().setTextAlign(item).run();
                        setAlign(item);
                      }}
                    >
                      {item === "left" ? (
                        <AlignLeft size={20} />
                      ) : item === "center" ? (
                        <AlignCenter size={20} />
                      ) : item === "right" ? (
                        <AlignRight size={20} />
                      ) : (
                        <AlignJustify size={20} />
                      )}
                      <span>
                        {item} {item === "justify" ? "" : "Align"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                ref={styleButtonRef}
                onClick={() => setStyleMenuOpen(!styleMenuOpen)}
                className={`flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium ${
                  styleMenuOpen ? "bg-gray-700" : ""
                }`}
              >
                <p className="capitalize">
                  {style === "h1"
                    ? "Major Heading"
                    : style === "h2"
                    ? "Heading"
                    : style === "h3"
                    ? "Subheading"
                    : style === "h4"
                    ? "Minor Heading"
                    : "Paragraph"}
                </p>
                <ChevronDown className="h-4 w-4" />
              </button>
              {styleMenuOpen && (
                <div
                  ref={styleMenuRef}
                  className="absolute left-0 top-full z-50 mt-1 w-36 rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg"
                >
                  {["h1", "h2", "h3", "h4", "paragraph"].map((item) => (
                    <button
                      key={item}
                      className="capitalize w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => applyStyle(item)}
                    >
                      {item === "h1"
                        ? "Major Heading"
                        : item === "h2"
                        ? "Heading"
                        : item === "h3"
                        ? "Subheading"
                        : item === "h4"
                        ? "Minor Heading"
                        : "Paragraph"}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("highlight") ? "bg-gray-700" : ""
              }`}
            >
              <Highlighter size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("strike") ? "bg-gray-700" : ""
              }`}
            >
              <Strikethrough size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => {
                setIsLinkModalOpen(true);
              }}
              className={`px-2 py-1 rounded-xl`}
            >
              <LinkIcon size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={addImage}
            >
              <ImageIcon size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`px-2 py-1 rounded-xl ${
                editor?.isActive("codeBlock") ? "bg-gray-700" : ""
              }`}
            >
              <Code size={20} />
            </motion.button>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setMoreOption(!moreOption)}
                className={`flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium ${
                  moreOption ? "bg-gray-700" : ""
                }`}
              >
                <Ellipsis size={20} />
              </button>
              {moreOption && (
                <div className="absolute px-2 flex gap-1 left-0 top-full z-50 mt-1 w-auto h-10 rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg">
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`px-2 py-1 rounded-xl ${
                      editor?.isActive("bulletList") ? "bg-gray-700" : ""
                    }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-2 py-1 rounded-xl ${
                      editor?.isActive("orderedList") ? "bg-gray-700" : ""
                    }`}
                  >
                    <ListOrdered size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
          <div className="bg-gray-800 border-t border-l border-r border-gray-600 rounded-xl mt-1 h-[calc(100vh-150px)] max-w-full lg:max-w-[calc(100vw-665px)] overflow-y-scroll shadow-md">
            <EditorContent editor={editor} className="prose prose-invert" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4">
            <div className="flex gap-2">
              <div className="flex border border-gray-700 rounded-xl">
                <button
                  ref={saveButtonRef}
                  onClick={() => {
                    setPreviewOpen(!previewOpen);
                  }}
                  className="rounded-l-xl p-2  flex items-center gap-2 border-r border-gray-700 hover:bg-gray-800 duration-300"
                >
                  <Eye size={18} />
                  Preview
                </button>
                <div className="relative">
                  <button
                    ref={saveButtonRef}
                    onClick={() => setSaveModal(!saveModal)}
                    className={`flex h-full items-center hover:bg-gray-700 gap-2 rounded-r-xl p-2  font-medium ${
                      saveModal ? "bg-gray-700" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </button>
                  {saveModal && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      ref={saveMenuRef}
                      className="absolute w-44 gap-1 -left-8 top-full z-50 mt-1 rounded-xl border border-gray-700 bg-gray-800 py-1 shadow-lg"
                    >
                      <button
                        onClick={() => {
                          setPreviewOpen(!previewOpen);
                        }}
                        className={`flex gap-4 px-4 py-1 rounded-t hover:bg-gray-700 w-full duration-300 items-center `}
                      >
                        <Eye size={18} />
                        Preview post
                      </button>
                      <button
                        onClick={() => saveBlog("draft")}
                        className={`rounded-b px-4 flex gap-4  py-1  hover:bg-gray-700 w-full duration-300 items-center 
                      `}
                      >
                        <Save size={18} />
                        {blogId && blog.status === 'published' ? 'Revert to draft' : 'Save' }
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
              <button
                onClick={() => saveBlog("published")}
                className="px-4 py-2 rounded-xl flex items-center gap-2 bg-teal-500 duration-300 text-[#ffff] font-bold hover:bg-teal-600"
              >
                <Send size={18} />
                Publish
              </button>
            </div>
            <div className="mt-4 bg-gray-700 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 flex gap-2 items-center">
                <Settings size={20} /> More Information
              </h3>
              <div className="space-y-2">
                <div className="relative flex rounded-lg">
                  <input
                    
                    defaultValue={label}
                    className="peer w-full bg-gray-900 outline-none px-4 py-2 text-base rounded-lg border-b border-l border-r border-gray-600 focus:shadow-md"
                    type="text"
                    id="label"
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  />
                  <label
                    className=" font-semibold absolute top-1/2 translate-y-[-50%] peer-focus:bg-transparent left-4 peer-focus:top-0 opacity-70 peer-focus:left-3 text-base peer-focus:text-sm peer-focus:text-[#fff] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm  duration-150"
                    htmlFor="label"
                  >
                    Label
                  </label>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Are you the original creator of this article?
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="">
                      <input
                        value="yes"
                        type="radio"
                        onChange={handleOptionChange}
                        checked={selectedOption === "yes"}
                        className=""
                      />
                      <span className="pl-2">
                        Yes, I am the original creator
                      </span>
                    </label>
                    <label className="">
                      <input
                        value="no"
                        type="radio"
                        onChange={handleOptionChange}
                        checked={selectedOption === "no"}
                      />
                      <span className="pl-1">
                        No, I found this article somewhere else and I want to
                        share it with the community here
                      </span>
                    </label>
                  </div>
                </div>
                {selectedOption === "no" && (
                  <AnimationWrapper transition={0.1}>
                    <div className="flex flex-col gap-4">
                      <div className="relative flex rounded-lg">
                        <input
                          
                          id="sourceLink"
                          defaultValue={sourceLink}
                          className="peer w-full bg-gray-900 outline-none px-4 py-2 text-base rounded-lg border-b border-l border-r border-gray-600 focus:shadow-md"
                          type="text"
                          onChange={(e) => {
                            setSourceLink(e.target.value);
                          }}
                        />
                        <label
                          className=" font-semibold absolute top-1/2 opacity-70 translate-y-[-50%] peer-focus:bg-transparent left-4 peer-focus:top-0 peer-focus:left-3 text-base peer-focus:text-sm peer-focus:text-[#fff] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm duration-150"
                          htmlFor="sourceLink"
                        >
                          Link to the source
                        </label>
                      </div>

                      <div className="relative flex rounded-lg">
                        <input
                          
                          defaultValue={sourceCreator}
                          className="peer w-full bg-gray-900 outline-none px-4 py-2 text-base rounded-lg border-b border-l border-r border-gray-600 focus:shadow-md"
                          type="text"
                          id="sourceCreator"
                          onChange={(e) => {
                            setSourceCreator(e.target.value);
                          }}
                        />
                        <label
                          className=" font-semibold absolute top-1/2 opacity-70 translate-y-[-50%] peer-focus:bg-transparent left-4 peer-focus:top-0 peer-focus:left-3 text-base peer-focus:text-sm peer-focus:text-[#fff] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm  duration-150"
                          htmlFor="sourceCreator"
                        >
                          Name of the creator/source
                        </label>
                      </div>
                    </div>
                  </AnimationWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageUploader && (
        <AnimationWrapper transition={0.1} className={"authentication-bg"}>
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Upload Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
              <button
                onClick={() => setShowImageUploader(false)}
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </AnimationWrapper>
      )}

      {isLinkModalOpen && (
        <AnimationWrapper className={"authentication-bg"} transition={0.1}>
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Insert Link</h2>
              <input
                type="text"
                placeholder="Link URL"
                className="w-full px-4 py-2 mb-4 bg-gray-700 rounded-lg outline-none"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Text to display"
                className="w-full px-4 py-2 mb-4 bg-gray-700 rounded-lg outline-none"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsLinkModalOpen(false);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (linkUrl && editor) {
                      editor
                        .chain()
                        .focus()
                        .setLink({ href: linkUrl })
                        .insertContent(linkText || linkUrl) // Use linkText if provided, otherwise use the URL
                        .run();
                      setIsLinkModalOpen(false);
                      setLinkUrl("");
                      setLinkText("");
                    }
                  }}
                  className="px-4 py-2 bg-teal-500 rounded-lg hover:bg-teal-600"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      )}

      {previewOpen && (
        <BlogPreview
          title={title}
          content={editor.getJSON()}
          label={label}
          handleCloseBtn={handleCloseBtn}
        />
      )}
    </div>
  );
}
