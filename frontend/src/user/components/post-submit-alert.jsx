import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../App";
import "../../utils/post-card.css";
import { Info, Rocket, Star, X } from "lucide-react";
import { motion } from "framer-motion";

function PostSubmitAlert({ 
  postData,
  setOpenModal,
  setProgress,
}) {
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);

  let titleLimit = 100;

  const [charactersLeft, setCharactersLeft] = useState(titleLimit);
  const [title, setTitle] = useState("");

  const handleCharacterChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setCharactersLeft(titleLimit - e.target.value.length);
    setTitle(e.target.value);
  };

  console.log(title);

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //enter key
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (previewRef.current) {
      if (!shadowRootRef.current) {
        shadowRootRef.current = previewRef.current.attachShadow({
          mode: "open",
        });
      }
      const shadowRoot = shadowRootRef.current;

      shadowRoot.innerHTML = `
              <style>
                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing:border-box;
                  }
                  ${postData.cssCode}
              </style>
              <div>${postData.htmlCode}</div>
          `;

      shadowRoot.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }
  }, []);

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");
    postData.title = title;
    postData.status = 'under_review';

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/create-post`,
        postData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setProgress(100);
      setOpenModal(false);
      e.target.classList.remove("disabled");
      toast.success("Post submitted successfully");
    } catch (error) {
      setProgress(100);
      e.target.classList.remove("disabled");
      setOpenModal(false);
      toast.error("Error occurred", error);
    }
  };

  const handleCloseBtn = () => {
    setOpenModal(false);
  };

  return (
    <div className="fixed z-[1000] inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-[1200px] bg-dark-700 text-white sm:px-20 p-4 py-14 overflow-visible border-[#222222]/80 border-2 rounded-3xl">
        <div className="flex gap-x-8 max-lg:flex-wrap">
          <div className=" grid grid-cols-button w-full md:w-1/2">
            <div className="pointer-events-none">
              <article
                className="card flex flex-col text-black h-full z-10 group bg-transparent"
                style={{ opacity: 1, willChange: "auto", transform: "none" }}
              >
                <div className="card-content flex-grow ">
                  <div className="absolute z-20 flex items-center left-1.5 top-[6px] gap-0.5"></div>
                  <div className="clickable-wrapper">
                    <div
                      ref={previewRef}
                      id="container"
                      className="card__button-container relative z-[1] preview-container"
                      style={{
                        backgroundColor: postData.backgroundColor,
                      }}
                    />
                    <button className="fake-link">Link to post</button>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center">
            <label
              for="title"
              className="block text-sm font-semibold text-gray-400 pl-2"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <div className="relative p-1 rounded-md shadow-sm">
              <textarea
                id="title"
                onKeyDown={handleTitleKeyDown}
                maxLength={titleLimit}
                onChange={handleCharacterChange}
                className="text-xl font-medium p-2 w-full outline-none resize-none rounded-md leading-tight placeholder:opacity-40 bg-[#212121]"
                placeholder="Give your post a beautiful title."
              ></textarea>
              <div className="flex justify-between">
                {" "}
                <p
                  className={`text-sm  ${
                    !title ? "text-red-400" : "opacity-0"
                  }`}
                >
                  Title is required
                </p>
                <p className="text-sm text-gray-400/50">{charactersLeft}</p>
              </div>
            </div>
            <p className="max-w-md text-base text-yellow-400 flex gap-1 mt-2">
              <Info />
              If you post without crediting the source, your account may be
              suspended.
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ damping: 10, stiffness: 400, type: "spring" }}
            onClick={handleSubmitBtn}
            className={`flex px-6 py-2 bg-gradient-to-tr text-white from-blue-400 to-teal-500 rounded-lg ${
              !title ? "opacity-20 pointer-events-none" : ""
            }`}
          >
            <Rocket />
            Submit for review
          </motion.button>
        </div>
        <button
          onClick={handleCloseBtn}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-[#a5a5a511] duration-300 "
        >
          <X />
        </button>
        <div></div>
      </div>
    </div>
  );
}

export default PostSubmitAlert;
