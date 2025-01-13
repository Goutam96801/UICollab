import React from 'react';
import { FolderClock, Rocket } from 'lucide-react';

export function SubmitButtons({ handleDraft, handleSubmit }) {
  return (
    <div className="items-stretch mt-4 p-2 col-span-full bg-[#212121] rounded-xl md:block">
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 h-full flex-wrap min-h-[40px]">
        <div>
      </div>
        <div className="flex justify-end items-stretch gap-2">
          <button
            onClick={handleDraft}
            className="px-4 py-2.5 font-sans hidden sm:flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 hover:bg-[#c5c5c511] text-offwhite cursor-pointer"
          >
            <FolderClock />
            Save as a draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
          >
            <Rocket />
            Submit for review
          </button>
        </div>
        
      </div>
    </div>
  );
}

