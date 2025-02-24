import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function BrowseByTags() {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const starCount = 50;

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute bg-white rounded-full animate-twinkle";
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
      }
    }
  }, []);

  const fetchTags = () => {
    axios
      .get(process.env.REACT_APP_SERVER_DOMAIN + "/tags")
      .then(({ data }) => {
        setTags(data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Function to split tags into three roughly equal parts
  const splitTags = (tags) => {
    const third = Math.ceil(tags.length / 3);
    return [
      tags.slice(0, third),
      tags.slice(third, 2 * third),
      tags.slice(2 * third),
    ];
  };

  const [firstLine, secondLine, thirdLine] = splitTags(tags);

  const renderTagLine = (tags, animationClass) => (
    <div className={`flex whitespace-nowrap ${animationClass}`}>
      {tags.concat(tags).map((tag, index) => (
        <motion.button
          onClick={() => navigate(`/tags/${tag}`)}
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 400, type: "spring", damping: 10 }}
          key={`${tag}-${index}`}
          className="text-sm m-1 py-1.5 px-2.5 border-2 border-[#212121] bg-[rgba(0,0,0,0.8)] rounded-lg flex items-center"
        >
          <Star className="w-4 h-4 mr-2" />
          {tag}
        </motion.button>
      ))}

    </div>
  );
  return (
    <div className="py-4  mx-auto bg-gradient-to-t from-[#212121]">
      
      <div
        className="overflow-hidden w-full p-5 shadow-lg relative "
        ref={containerRef}
      >
        {renderTagLine(firstLine, "animate-moveLeft")}
        {renderTagLine(secondLine, "animate-moveRight")}
        {renderTagLine(thirdLine, "animate-moveLeft")}
      </div>{" "}
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
        Explore the Universe by Tags
      </h2>
    </div>
  );
}
