import { CodeXml } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const AdminPostCard = ({ item, setProgress }) => {
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
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(
        `/admin/posts/${item.author.personal_info.username}/${item.postId}`
      );
    }, 500);
  };

  return (
    <article className="card duration-300 transition-all relative isolate flex flex-col text-black h-full overflow-hidden rounded-md">
      <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow">
        <div className=" h-full w-full flex justify-center items-center overflow-hidden">
          <div className="relative  bg-gray-200 flex items-center justify-center cursor-pointer h-full"></div>
          <div className="z-10" ref={previewRef} />
          <Link
            onClick={handleLinkClick}
            className="card-btn absolute bottom-2 z-50 right-2 gap-1 bg-yellow-500 text-black font-semibold px-2 py-1 rounded text-sm"
          >
            <CodeXml /> Review Code
          </Link>
        </div>
      </div>
    </article>
  );
};

export default AdminPostCard;
