import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { fixResizeObserverLoop } from "../../utils/resize-observer-fix";
import { AIAssistant } from "../../user/components/ai-assistant";
import { X } from "lucide-react";
import { AdminContext } from "../../App";
import { EditorTabs } from "../../user/components/editor-tabs";
import AnimationWrapper from "../../common/page-animation";
import * as LucidIcons from "lucide-react";

export default function AddCategory(props) {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("html");

  const {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const postData = {
    name: name.toLowerCase(),
    icon: icon,
    defaultHtmlCode: htmlCode,
    defaultCssCode: cssCode,
  };

  const getIconComponent = (name) => {
    // Dynamically find the component from imported icons
    const IconComponent = LucidIcons[name];
    return IconComponent ? <IconComponent size={24} /> : null;
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem("aiAssistantHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aiAssistantHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.setProgress(70);
    e.target.classList.add("disabled");

    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/create-category",
        postData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((data) => {
        props.setProgress(100);
        e.target.classList.remove("disabled");

        toast.success("Category created successfully");
      })
      .catch((err) => {
        props.setProgress(100);
        e.target.classList.remove("disabled");
        console.log(err);
        toast.error(err.response?.data?.error || "Something went wrong!");
      });
  };

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 10,
        alwaysConsumeMouseWheel: false,
      },
      fontSize: 14,
      wordWrap: "on",
      autoIndent: true,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoClosingComments: "always",
    }),
    []
  );

  const handleAIGeneratedCode = (generatedHtmlCode, generatedCssCode) => {
    setHtmlCode(generatedHtmlCode);
    setCssCode(generatedCssCode);
  };

  useEffect(() => {
    fixResizeObserverLoop();
  }, []);

  const srcDoc = `
    <html style="height:97%">
      <head>
        <script>console.warn = () => {};</script>
        <script>
          window.onload = function() {
            var head = document.querySelector('head');
            var styleTag = document.querySelector('head style:not([data-custom-challenge-css])');
            window.parent.postMessage(styleTag.innerHTML, "https://uicollab.io");
          };

          const preventNavigation = (t,e)=>{e!=="loader"&&e!=="pattern"&&t.stopImmediatePropagation();const r=t.target,n=s=>s.tagName.toLowerCase()==="a"||s.closest("a")!==null,o=s=>s.tagName.toLowerCase()==="button"||s.closest("button")!==null,a=s=>s.tagName.toLowerCase()==="form"||s.closest("form")!==null;if(n(r)||o(r)||a(r))console.log("Preventing navigation");else return;t.preventDefault(),t.stopPropagation()}

          document.addEventListener('click', e => preventNavigation(e, undefined));
        </script>
        <style data-custom-challenge-css>${cssCode}</style>
      </head>
      <body style="display:flex;align-items:center;justify-content:center;height:100%;" class="preview-container">
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 mx-auto p-6 h-[100vh] w-[calc(100vw-250px)] overflow-y-auto"
    >
      <Toaster />
      <div className="max-h-[calc(100vh-10rem)] px-4">
        <div className="flex gap-2 mb-2">
          <div className="w-full relative rounded-lg">
            <input
              type="text"
              id="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="peer w-full bg-gray-900 outline-none px-4 py-2 text-base rounded-lg border-b border-l border-r border-gray-600 focus:shadow-md"
            />
            <label
              className=" font-semibold absolute top-1/2 translate-y-[-50%] peer-focus:bg-transparent left-4 peer-focus:top-0 opacity-70 peer-focus:left-3 text-base peer-focus:text-sm peer-focus:text-[#fff] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm  duration-150"
              htmlFor="name"
            >
              Name of category<span className="text-red-500">*</span>
            </label>
          </div>
          <div className="w-full relative">
            
            <div className="flex">
              <input
                type="text"
                autoComplete="new-password"
                name="icon"
                id="icon"
                onChange={(e) => {
                  setIcon(e.target.value);
                }}
                className="peer w-full bg-gray-900 outline-none px-4 py-2 text-base rounded-lg border-b border-l border-r border-gray-600 focus:shadow-md"
                placeholder="e.g., CheckIcon for <CheckIcon />"
              />
               <label
              className=" font-semibold absolute top-1/2 translate-y-[-50%] peer-focus:bg-transparent left-4 peer-focus:top-0 opacity-70 peer-focus:left-3 text-base peer-focus:text-sm peer-focus:text-[#fff] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm  duration-150"
              htmlFor="name"
            >
              Icon from lucide-react<span className="text-red-500">*</span>
            </label>
              <div className="absolute right-0 top-2 px-1 border-l-2 border-gray-400/40 duration-300 transition-all">
                {icon ? (
                  getIconComponent(icon) || (
                    <span className="text-red-500">Invalid Icon</span>
                  )
                ) : (
                  <span className="text-gray-400">No icon selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row  gap-2 ">
          <div className="flex relative bg-[#e8e8e8] rounded-md w-full md:w-1/2 left-0 top-0 py-10 overflow-hidden h-[calc(100vh-10rem)]">
            <div className="flex h-full w-full relative z-[1]">
              <iframe
                title="Preview Content"
                srcDoc={srcDoc}
                width="100%"
                height="100%"
              ></iframe>
            </div>
            <div className="p-4 flex items-center gap-3 absolute top-0 right-0 z-10">
              <p className="font-semibold ">Preview</p>
            </div>
          </div>
          <div className="w-full h-[calc(100vh-10rem)] md:w-1/2 pl-2 rounded">
            <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="w-full h-[calc(100vh-12.3rem)] border border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
              <MonacoEditor
                height="100%"
                language={activeTab}
                theme="vs-dark"
                value={activeTab === "html" ? htmlCode : cssCode}
                onChange={(value) =>
                  activeTab === "html"
                    ? setHtmlCode(value || "")
                    : setCssCode(value || "")
                }
                options={editorOptions}
              />
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ stiffness: 400, damping: 10, type: "spring" }}
          className={` px-4 py-2 font-semibold bg-gradient-to-br from-purple-400 to-teal-400 rounded-full mt-2 ${
            !name || !getIconComponent(icon) || !htmlCode
              ? "pointer-events-none opacity-50"
              : ""
          }`}
          onClick={handleSubmit}
        >
          Create
        </motion.button>
        <div>
          <AnimatePresence>
            {showAIAssistant && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: -50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: -50 }}
                className="fixed bottom-[82px] right-[14px] w-1/2  z-50"
              >
                <AIAssistant
                  onCodeGenerated={handleAIGeneratedCode}
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="fixed bottom-4 right-6 bg-gradient-to-bl from-purple-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
          >
            {showAIAssistant ? (
              <X className="w-6 h-6" />
            ) : (
              <img src="/AI-Assistant.png" className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
