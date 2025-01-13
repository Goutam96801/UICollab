import React from 'react';

export function EditorTabs({ activeTab, setActiveTab, useTailwind }) {
  return (
    <div className="mb-0 flex">
      <button
        className={`px-4 py-[6px] rounded-t text-white font-semibold flex items-center gap-1 ${
          activeTab === "html" ? "bg-[#71717111]" : "bg-[#434343] "
        }`}
        onClick={() => setActiveTab("html")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="text-[#e74d4d] w-5 h-5"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path
            fill="currentColor"
            d="M12 18.178l4.62-1.256.623-6.778H9.026L8.822 7.89h8.626l.227-2.211H6.325l.636 6.678h7.82l-.261 2.866-2.52.667-2.52-.667-.158-1.844h-2.27l.329 3.544L12 18.178zM3 2h18l-1.623 18L12 22l-7.377-2L3 2z"
          ></path>
        </svg>
        {useTailwind ? "HTML + Tailwind CSS" : "HTML"}
      </button>
      {!useTailwind && (
        <button
          className={`px-4 py-[6px] rounded-t text-white font-semibold flex items-center gap-1 ${
            activeTab === "css" ? "bg-[#a5a5a511]" : "bg-[#434343] "
          }`}
          onClick={() => setActiveTab("css")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="text-blue-600 w-5 h-5"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3z"
            ></path>
          </svg>
          CSS
        </button>
      )}
    </div>
  );
}

