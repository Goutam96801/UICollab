import axios from "axios";
import { Bookmark, BookMarked, CodeXml } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import ClipLoader from "react-spinners/ClipLoader";
import "../../utils/post-card.css";

const PostCard = ({ post, user, setProgress }) => {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tailwindLoaded, setTailwindLoaded] = useState(false); // Added state for Tailwind loading
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (user && Array.isArray(user.saved_post)) {
      setIsSaved(user.saved_post.includes(post._id));
    }
  }, [post._id, user]);

  const toggleSave = async () => {
    setLoading(true);
    if (!user) {
      alert("Please log in to save the post");
      return;
    }
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
        console.error("Error toggling save status:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (previewRef.current) {
      if (!shadowRootRef.current) {
        shadowRootRef.current = previewRef.current.attachShadow({
          mode: "open",
        });
      }
      const shadowRoot = shadowRootRef.current;

      // Add Tailwind CSS if the post uses it
      const tailwindCDN = post.tailwindCSS
        ? 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
        : '';

      // Create a new link element for Tailwind CSS
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = tailwindCDN;

      // Create a new style element for custom CSS
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        ${post.cssCode}
      `;

      // Create a div for the HTML content
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = post.htmlCode;

      // Clear previous content and append new elements
      shadowRoot.innerHTML = '';
      if (post.tailwindCSS) {
        shadowRoot.appendChild(linkElement);
      }
      shadowRoot.appendChild(styleElement);
      shadowRoot.appendChild(contentDiv);

      shadowRoot.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      // Ensure Tailwind styles are applied after the stylesheet is loaded
      if (post.tailwindCSS) {
        linkElement.onload = () => {
          contentDiv.classList.add('tailwind');
          setTailwindLoaded(true);
        };
      } else {
        setTailwindLoaded(true);
      }
    }
  }, [post.htmlCode, post.cssCode, post.tailwindCSS]);

  const handleLinkClick = (e) => {
    if (shadowRootRef.current && shadowRootRef.current.contains(e.target)) {
      return;
    }
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(`/${post.author.personal_info.username}/${post.postId}`);
    }, 500);
  };

  return (
    <article
      className="card flex flex-col text-black h-full z-10 group bg-transparent"
      style={{ opacity: 1, willChange: "auto", transform: "none" }}
    >
      <div className="card-content flex-grow ">
        <Link
          className="font-sans font-semibold get-code bg-[#3b3b3b]"
          onClick={handleLinkClick}
        >
          <CodeXml /> Get code
        </Link>
        <div className="absolute z-20 flex items-center left-1.5 top-[6px] gap-0.5" ></div>
        <div className="clickable-wrapper" onClick={handleLinkClick}>
          <div
            ref={previewRef}
            id="container"
            className="card__button-container relative z-[1] preview-container"
            style={{ backgroundColor: post.theme === 'dark' ? '#212121' : '#e8e8e8' }}
          >
            {!tailwindLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <ClipLoader size={30} color="#3b3b3b" />
              </div>
            )}
          </div>
          <button
            className="fake-link"
            onClick={handleLinkClick}
          >
            Link to post
          </button>
        </div>
      </div>
      <div className="card__footer h-[28px]">
        <div className="">
          <Link to={`/profile/${post.author?.personal_info?.username}`}>
            <div className="card__nickname text-color flex items-center gap-1.5">
              {post.author.personal_info.username}
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1 card__views">
          <span>{post.activity.total_views} views</span>
          <button className="flex hover:bg-dark-500 bg-transparent py-0.5 px-1 text-sm gap-0.5 text-gray-300 cursor-pointer transition-colors  font-sans font-semibold border-none items-center overflow-hidden rounded-md hover:bg-[#303030]" onClick={toggleSave}>
            {loading ? (
              <ClipLoader size={15}/>
            ) : (
              isSaved ? <BookMarked className="w-4 h-4 text-yellow-500" /> : <Bookmark className="w-4 h-4" />
            )}
            {post.activity.total_saves}
          </button>
        </div>
      </div>
    </article>

  );
};

export default PostCard;

