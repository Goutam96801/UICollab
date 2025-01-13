"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function AnimatedSocialCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-56 h-[280px] bg-gradient-to-br from-purple-400 to-teal-400 rounded-xl shadow-lg flex flex-col items-center justify-between p-6 text-white overflow-hidden relative"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="w-full h-32 relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50 L100,0 L0,0 Z"
            fill="rgba(255,255,255,0.1)"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.path
            d="M0,50 Q25,70 50,50 T100,50 L100,0 L0,0 Z"
            fill="rgba(255,255,255,0.2)"
            initial={{ y: -20 }}
            animate={{ y: isHovered ? 0 : -20 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-4xl">✨</span>
        </motion.div>
      </div>

      <motion.h2
        className="text-2xl font-bold text-center absolute inset-x-0 text-purple-900"
        initial={{ bottom: "1.5rem" }}
        animate={{
          top: isHovered ? "1.5rem" : "auto",
          bottom: isHovered ? "auto" : "1.5rem",
        }}
        transition={{ duration: 0.3 }}
      >
        We're on Social Media!
      </motion.h2>
      <motion.p
        className="text-sm text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        Connect with us on your favorite platforms
      </motion.p>
      <motion.div
        className="flex space-x-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isHovered ? 0 : 50, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialButton
          icon={<Instagram size={24} />}
          href="https://instagram.com"
        />
        <SocialButton
          icon={
           <img src="/twitter.png" alt="" width={24}/>
          }
          href="https://twitter.com"
        />
        <SocialButton
          icon={
            <svg
              width="33"
              height="27"
              className="w-6 h-6"
              viewBox="0 0 33 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.9541 2.81323C25.818 1.81378 23.5339 1.08742 21.146 0.673828C20.8527 1.20404 20.5101 1.91719 20.2739 2.4845C17.7354 2.10275 15.2203 2.10275 12.7286 2.4845C12.4924 1.91719 12.142 1.20404 11.8461 0.673828C9.45561 1.08742 7.16891 1.81645 5.03277 2.81853C0.724134 9.32943 -0.443865 15.6786 0.140135 21.9377C2.99785 24.0717 5.76731 25.3681 8.49004 26.2164C9.1623 25.2912 9.76186 24.3077 10.2784 23.2711C9.29466 22.8973 8.35248 22.4361 7.46223 21.9006C7.69841 21.7256 7.92943 21.5426 8.15262 21.3544C13.5825 23.8941 19.4822 23.8941 24.8473 21.3544C25.0731 21.5426 25.3041 21.7256 25.5377 21.9006C24.6448 22.4387 23.7 22.9 22.7163 23.2738C23.2328 24.3077 23.8298 25.2939 24.5046 26.219C27.23 25.3707 30.002 24.0744 32.8597 21.9377C33.545 14.6818 31.6892 8.39096 27.9541 2.81323ZM11.0181 18.0884C9.38812 18.0884 8.05138 16.5667 8.05138 14.7136C8.05138 12.8606 9.35957 11.3363 11.0181 11.3363C12.6767 11.3363 14.0134 12.8579 13.9848 14.7136C13.9874 16.5667 12.6767 18.0884 11.0181 18.0884ZM21.9818 18.0884C20.3518 18.0884 19.015 16.5667 19.015 14.7136C19.015 12.8606 20.3232 11.3363 21.9818 11.3363C23.6403 11.3363 24.977 12.8579 24.9485 14.7136C24.9485 16.5667 23.6403 18.0884 21.9818 18.0884Z"
                fill="currentColor"
              ></path>
            </svg>
          }
          href="https://discord.com"
        />
      </motion.div>
    </motion.div>
  );
}

function SocialButton({ icon, href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.a>
  );
}
