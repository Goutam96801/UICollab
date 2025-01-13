import {
  BadgeX,
  Ban,
  Check,
  Moon,
  MoveLeft,
  Sun,
  UserRound,
} from "lucide-react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../App";
import ApproveModal from "../components/approve-modal";
import PostRejectAlert from "../components/reject-modal";
import { EditorTabs } from "../../user/components/editor-tabs";
import { Preview } from "../../user/components/preview";
import { fixResizeObserverLoop } from "../../utils/resize-observer-fix";
export const postDataStructure = {
  category: "",
  createdAt: "",
  cssCode: "",
  tailwindCss:false,
  htmlCode: "",
  postId: "",
  saved: 0,
  status: "",
  tags: [],
  updatedAt: "",
  author: { personal_info: {} },
};

function AdminPostDetails(props) {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(postDataStructure);
  const [activeTab, setActiveTab] = useState("html");
  const [backgroundColor, setBackgroundColor] = useState("#212121");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  let {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  let {
    category,
    htmlCode,
    cssCode,
    tailwindCss,
    updatedAt,
    author: {
      personal_info: { username, profile_img },
    },
    createdAt,
  } = post;

  const fetchPostDetails = () => {
    if (!access_token) return;

    setLoading(true); // Start loading

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/get-post",
        { postId: postId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(data)
        setPost(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [access_token]);

  

  const handleApprove = () => {
    props.setProgress(70);
    setTimeout(() => {
        props.setProgress(100)
        setApproveModal(true);
    },500)
  }

  const handleReject = () => {
    props.setProgress(70);
    setTimeout(() => {
        props.setProgress(100)
        setRejectModal(true);
    },500)
  }

  const handleCloseBtn = () => {
    setRejectModal(false)
  }

  const handleGoBack = () => {
    props.setProgress(70);
    setTimeout(() => {
        props.setProgress(100);
        navigate(-1);
    },500)
  }

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setBackgroundColor("#e8e8e8");
      setIsDarkMode(false);
    } else {
      setBackgroundColor("#212121");
      setIsDarkMode(true);
    }
  };

  const getLuminance = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb.map((value) => {
      const sRGB = value / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

    const editorOptions = useMemo(
      () => ({
        minimap: { enabled: true },
        readOnly:true,
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
        fixResizeObserverLoop();
      }, []);

  // Determine text color based on luminance
  const textColor = getLuminance(backgroundColor) < 0.5 ? "white" : "black";

  return (
    <AnimationWrapper transition>
      <div className="flex justify-between w-[calc(100vw-250px)] px-4 py-2  my-2">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 bg-[#212121] px-2 py-1 rounded-md hover:bg-[#2c2c2c] duration-300"
        >
          {" "}
          <MoveLeft />
          Go back
        </button>
        <div className="flex items-center space-x-1 text-base font-medium text-gray-400">
          <h1 className="capitalize text-nowrap">{category}</h1>
          <p>by</p>
          <Link
            to={`/profile/${username}`}
            className=" hover:text-gray-200 px-4 pl-3 py-2 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300 duration-300 hover:bg-[#a5a5a511]"
          >
            <img
              src={profile_img}
              alt="profile"
              className="w-6 h-6 rounded mr-2"
            />
            <span className="whitespace-nowrap">{username}</span>
          </Link>
        </div>
      </div>
      <div className="max-h-[calc(100vh-10rem)] w-[calc(100vw-250px)] px-4">
        <Toaster />
        <div className="flex flex-col-reverse md:flex-row bg-[#28282811] gap-2">
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
            <div className="w-full h-[calc(100vh-12.3rem)] border border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
              <MonacoEditor
                height="100%"
                language={activeTab}
                theme="vs-dark"
                value={activeTab === "html" ? htmlCode : cssCode}
                
                options={editorOptions}
              />
            </div>
          </div>
        </div>

        
        <div className="items-stretch mt-2 p-2 col-span-full bg-[#212121] rounded-xl md:block">
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 h-full flex-wrap min-h-[40px]">
            <div className="text-sm text-gray-400">
              <h1>Created at:</h1>
              <p className="text-gray-300">
                {Date(createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </div>

            <div className={` justify-end items-stretch gap-2 ${post.status === 'under_review' ? ' flex ' : ' hidden '}`}>
              <button
                onClick={handleReject}
                className="px-4 py-2.5 font-sans hidden sm:flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 bg-red-600 hover:bg-red-600/80 text-offwhite cursor-pointer"
              >
                <Ban />
                Reject
              </button>
              <button
                onClick={(handleApprove)}
                className=" px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer text-white bg-green-600 hover:bg-green-600/80 whitespace-nowrap"
              >
                <Check />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        approveModal ? <ApproveModal setProgress={props.setProgress} post={post} setApproveModal={setApproveModal} approveModal={approveModal}/> : (rejectModal ? <PostRejectAlert postId={postId} rejectmodal={rejectModal} setRejectModal={setRejectModal}/> : ' ')
      }
    </AnimationWrapper>
  );
}

export default AdminPostDetails;
