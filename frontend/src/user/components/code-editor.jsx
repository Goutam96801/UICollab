import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { UserContext } from "../../App";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../../common/page-animation";
import PostSubmitAlert from "./post-submit-alert";
import { useTheme } from "../hooks/use-theme";
import { useCodeState } from "../hooks/use-code-state";
import { Preview } from "./preview";
import { EditorTabs } from "./editor-tabs";
import { SubmitButtons } from "./submit-button";
import { fixResizeObserverLoop } from "../../utils/resize-observer-fix";
import { AIAssistant } from "./ai-assistant";
import { X } from "lucide-react";

export default function CodeEditor({
  selectedCategory,
  useTailwind,
  setProgress,
}) {
  const { htmlCode, cssCode, setHtmlCode, setCssCode } =
    useCodeState(selectedCategory);
  const [openModal, setOpenModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(useTailwind ? "html" : "css");
  const { backgroundColor, isDarkMode, toggleDarkMode, setBackgroundColor } =
    useTheme();

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    const storedHistory = localStorage.getItem("aiAssistantHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aiAssistantHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const postData = {
    htmlCode,
    cssCode: useTailwind ? "" : cssCode,
    category: selectedCategory,
    backgroundColor,
    status: "under_review",
    theme: isDarkMode ? "dark" : "light",
    useTailwind,
    title: "",
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");

    setTimeout(() => {
      setOpenModal(!openModal);
      e.target.classList.remove("disabled");
      setProgress(100);
    }, 500);
  };

  const handleDraft = async (e) => {
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");

    const draftPostData = {
      htmlCode,
      cssCode: useTailwind ? "" : cssCode,
      category: selectedCategory,
      backgroundColor,
      status: "draft",
      theme: isDarkMode ? "dark" : "light",
      useTailwind,
      title: "",
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/create-post`,
        draftPostData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setProgress(100);
      e.target.classList.remove("disabled");
      toast.success("Saved to draft.");
    } catch (error) {
      setProgress(100);
      e.target.classList.remove("disabled");
      console.log(error)
      toast.error("Error occurred");
    }
  };

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: true },
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

  const handleAIGeneratedCode = (generatedHtmlCode, generatedCssCode) => {
    setHtmlCode(generatedHtmlCode);
    setCssCode(generatedCssCode);
  };

  useEffect(() => {
    fixResizeObserverLoop();
  }, []);

  return (
    <AnimationWrapper transition>
      <div className="max-h-[calc(100vh-10rem)] px-4">
        <Toaster />
        <div className="flex flex-col-reverse md:flex-row bg-[#28282811] gap-2">
          <Preview
            backgroundColor={backgroundColor}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            htmlCode={htmlCode}
            cssCode={cssCode}
            useTailwind={useTailwind}
            setBackgroundColor={setBackgroundColor}
          />
          <div className="w-full h-[calc(100vh-10rem)] md:w-1/2 pl-2">
            <EditorTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              useTailwind={useTailwind}
            />
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
        <SubmitButtons handleDraft={handleDraft} handleSubmit={handleSubmit} />
        <div>
          <AnimatePresence>
            {showAIAssistant && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: -50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: -50 }}
                className="fixed bottom-[82px] left-[14px] w-1/2  z-50"
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
            className="fixed bottom-[30px] left-6 bg-gradient-to-bl from-purple-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
          >
            {showAIAssistant ? (
              <X className="w-6 h-6" />
            ) : (
              <img src="/AI-Assistant.png" alt="" className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {openModal && (
        <PostSubmitAlert
          postData={postData}
          setOpenModal={setOpenModal}
          setProgress={setProgress}
          backgroundColor={backgroundColor}
        />
      )}
    </AnimationWrapper>
  );
}
