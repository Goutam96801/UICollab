import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function Preview({
  backgroundColor,
  isDarkMode,
  toggleDarkMode,
  htmlCode,
  cssCode,
  useTailwind,
  setBackgroundColor,
}) {
  const textColor = getLuminance(backgroundColor) < 0.5 ? "white" : "black";

  const srcDoc = `
    <html style="height:97%">
      <head>
        <script>console.warn = () => {};</script>
        
        ${
          useTailwind
            ? '<script src="https://cdn.tailwindcss.com"></script>'
            : ""
        }
        <style data-custom-challenge-css>${useTailwind ? "" : cssCode}</style>
      </head>
      <body style="display:flex;align-items:center;justify-content:center;height:100%;" class="preview-container">
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <div
      style={{ backgroundColor: backgroundColor }}
      className="flex relative rounded-md w-full md:w-1/2 left-0 top-0 py-10 overflow-hidden h-[calc(100vh-10rem)]"
    >
      <div className="flex h-full w-full text-black relative z-[1]">
        <iframe
          title="Preview Content"
          srcDoc={srcDoc}
          width="100%"
          height="100%"
          sandbox="allow-scripts"
        ></iframe>
      </div>
      <div className="p-4 flex items-center gap-3 absolute top-0 right-0 z-10">
        <p style={{ color: textColor }} className="font-semibold">
          {backgroundColor}
        </p>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-8 h-8 rounded-t border-none outline-none bg-[#212121]"
        />
        <button
          onClick={toggleDarkMode}
          className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <motion.div
            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
            animate={{ x: isDarkMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {isDarkMode ? (
              <Moon className="h-3 w-3 text-gray-700" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-500" />
            )}
          </motion.div>
        </button>
      </div>
    </div>
  );
}

function getLuminance(hexColor) {
  const rgb = hexToRgb(hexColor);
  const [r, g, b] = rgb.map((value) => {
    const sRGB = value / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
