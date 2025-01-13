import { Github } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="">
              <img className="logo max-w-[85px]" src="/logo.svg" alt=""></img>
              <p className="max-w-xs mt-5 text-base leading-5 text-gray-400">Collaborative space for UI developers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/github"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              to="/discord"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Discord
            </Link>
            <Link
              to="/twitter"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
