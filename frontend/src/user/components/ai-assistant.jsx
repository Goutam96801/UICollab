import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import {
  Loader2,
  Send,
  Copy,
  Check,
  Pen,
  Mic,
  ChevronDown,
} from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { motion, AnimatePresence } from "framer-motion";
import { AdminContext, UserContext } from "../../App";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnimationWrapper from "../../common/page-animation";
import GeminiLoader from "../../ui/gemini-loading-animation";

export function AIAssistant({ chatHistory, setChatHistory }) {
  const [question, setQuestion] = useState("");
  const [aiModelDropdown, setAiModelDropdown] = useState(false);
  const [aiModel, setAiModel] = useState("1.5-flash");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [error, setError] = useState("");
  const [copiedStates, setCopiedStates] = useState({});
  const [typingIndex, setTypingIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const geminiModelRef = useRef(null);
  const geminiModelMenuRef = useRef(null);
  const { userAuth } = useContext(UserContext);
  const { adminAuth } = useContext(AdminContext);

  let fullname = userAuth?.fullname || adminAuth?.fullname || "";
  const name = fullname.split(" ")[0];

  const geminiModel = ["1.5-pro", "1.5-flash-8b", "1.5-flash", "2.0-flash-exp"];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [generatingAnswer]);

  useEffect(() => {
    if (typingIndex >= 0 && typingIndex < chatHistory.length) {
      const currentEntry = chatHistory[typingIndex];
      if (currentEntry.type === "answer") {
        let i = 0;
        const typingInterval = setInterval(() => {
          if (i < currentEntry.content.length) {
            setChatHistory((prev) => {
              const newHistory = [...prev];
              newHistory[typingIndex] = {
                ...newHistory[typingIndex],
                displayContent: currentEntry.content.slice(0, i + 1),
              };
              return newHistory;
            });
            i++;
          } else {
            clearInterval(typingInterval);
            setTypingIndex(-1);
          }
        }, 20);
        return () => clearInterval(typingInterval);
      }
    }
  }, [typingIndex, chatHistory, setChatHistory]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setQuestion(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const clearChat = () => {
    setChatHistory([]);
    setQuestion("");
    setError("");
    setCopiedStates({});
    setTypingIndex(-1);
  };

  const handleClickOutside = (event) => {
    if (
      aiModelDropdown &&
      geminiModelMenuRef.current &&
      !geminiModelMenuRef.current.contains(event.target) &&
      !geminiModelRef.current.contains(event.target)
    ) {
      setAiModelDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aiModelDropdown]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      // Constructing the chat history
      const formattedHistory = chatHistory
        .filter((entry) => entry.type === "question" || entry.type === "answer")
        .map((entry) =>
          entry.type === "question"
            ? `You: ${entry.content}`
            : `AI: ${entry.content}`
        )
        .join("\n");

      const requestPayload = {
        contents: [
          {
            parts: [
              { text: formattedHistory }, // Include the chat history
              { text: `You: ${currentQuestion}` }, // Include the current question
            ],
          },
        ],
      };

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-${aiModel}:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        method: "post",
        data: requestPayload,
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
      setAnswer(aiResponse);
      setTypingIndex(chatHistory.length + 1);
    } catch (error) {
      console.error("Error generating answer:", error);
      setError("Something went wrong. Please try again.");
    }

    setGeneratingAnswer(false);
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates({ ...copiedStates, [index]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [index]: false });
      }, 2000);
    });
  };

  const renderCodeBlock = (code, language, index) => {
    return (
      <div className="relative mt-2 mb-4 bg-[#010101] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d]">
          <span className="text-sm text-gray-400">{language}</span>
          <button
            onClick={() => copyToClipboard(code, `code-${index}`)}
            className="p-2 hover:bg-[#3d3d3d] rounded-full transition-colors"
            aria-label="Copy code"
          >
            {copiedStates[`code-${index}`] ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const renderTextBlock = (text, index) => {
    return (
      <ReactMarkDown
        remarkPlugins={[remarkGfm]}
        key={`text-${index}`}
        className="text-wrap"
      >
        {text}
      </ReactMarkDown>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-[#1a1a1a] rounded-lg shadow-xl px-4 py-2 h-[84vh] flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4">
          <h2 className=" bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 flex items-baseline text-2xl font-bold ">
            UI<p className="italic text-sm font-semibold">Genie</p>
          </h2>

          <motion.div
            className="max-w-2xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              ref={geminiModelRef}
              onClick={() => setAiModelDropdown(!aiModelDropdown)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium  hover:bg-[#212121] hover:text-white duration-300 ${
                aiModelDropdown ? "bg-[#212121] text-white " : "text-zinc-400"
              }`}
            >
              <p className="capitalize">{aiModel}</p>
              <ChevronDown className="h-4 w-4" />
            </button>
            {aiModelDropdown && (
              <AnimationWrapper transition={0.2}>
                <div
                  ref={geminiModelMenuRef}
                  className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-zinc-800 bg-[#121212] py-1 shadow-lg"
                >
                  {geminiModel.map((model, index) => (
                    <button
                      key={index}
                      className="w-full px-4 z-50 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                      onClick={() => setAiModel(model)}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </AnimationWrapper>
            )}
          </motion.div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-[#2d2d2d] rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="New chat"
        >
          <Pen className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto rounded-lg p-2 mb-2 custom-scrollbar"
      >
        <AnimatePresence>
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <p className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 font-bold">
                Hello {name}
              </p>
            </div>
          ) : (
            <>
              {chatHistory.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`chat-entry mb-4 overflow-x-auto ${
                    entry.type === "question" ? "text-right " : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block ${
                      entry.type === "question"
                        ? "bg-[#212121] ml-auto px-4 py-2 rounded-2xl"
                        : " w-full p-4"
                    } `}
                  >
                    {entry.type === "question" ? (
                      ""
                    ) : (
                      <img src="/AI-Assistant.png" width={25} />
                    )}

                    {entry.content.includes("```") ? (
                      <>
                        {entry.content.split("```").map((block, blockIndex) => {
                          if (blockIndex % 2 === 1) {
                            const [language, ...codeLines] = block.split("\n");
                            const code = codeLines.join("\n").trim();
                            return renderCodeBlock(
                              code,
                              language.trim(),
                              `${index}-${blockIndex}`
                            );
                          } else {
                            return renderTextBlock(
                              block,
                              `${index}-${blockIndex}`
                            );
                          }
                          return null;
                        })}
                      </>
                    ) : (
                      <p className="text-white mb-2">{entry.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
        {generatingAnswer && (
          <GeminiLoader className="w-4 h-4 mr-2 animate-spin" />
        )}
      </div>
      <form onSubmit={generateAnswer} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Genie..."
          className="w-full px-4 py-3 bg-[#2d2d2d] text-white rounded-lg pr-32 focus:outline-none placeholder-gray-500"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-full text-gray-400 hover:text-gray-300 transition-colors ${
              isListening
                ? " bg-gradient-to-tr from-purple-400 to-teal-400 text-[#fff]"
                : ""
            }`}
          >
            <Mic className="w-5 h-5 " />
          </button>
          <button
            type="submit"
            className="p-2 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={generatingAnswer || !question.trim()}
          >
            {generatingAnswer ? (
              <motion.div
                className="w-6 h-6"
                animate={{
                  opacity: [0.4, 0.7, 1, 0.7, 0.5],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0.4, 0.7, 1], // Sync opacity with rotation
                }}
              >
                <img src="/gemini_logo.svg" alt="" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </motion.div>
  );
}
