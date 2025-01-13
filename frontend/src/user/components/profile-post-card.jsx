import { CodeXml } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const ProfilePostCard = ({ item }) => {
  const previewRef = useRef(null); // Ref for the div that will hold the shadow DOM
  const shadowRootRef = useRef(null); // Ref for the shadow root
  const navigate = useNavigate();

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
                    }
                    ${item.cssCode}
                </style>
                <div>${item.htmlCode}</div>
            `;
    }
  }, [item.htmlCode, item.cssCode]);

  const handleLinkClick = () => {
    navigate(`/${item.author.personal_info.username}/${item.postId}`);
  };

  return (
    <article className="card duration-300 transition-all relative isolate flex flex-col text-black h-full overflow-hidden rounded-md">
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
            style={{ backgroundColor: item.theme === 'dark' ? '#212121' : '#e8e8e8' }}
          /> 
          <button
            className="fake-link"
            onClick={handleLinkClick}
          >
            Link to post
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProfilePostCard;
