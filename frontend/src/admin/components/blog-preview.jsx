import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import { X } from "lucide-react";
import "../../utils/editor.css";

const BlogPreview = ({ title, content, label, handleCloseBtn }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="z-50 authentication-bg transition-all duration-300 ">
      <div className=" block relative w-[100vw] md:w-[calc(100vw-100px)] h-[calc(100vh-60px)] bg-dark-700 p-8 py-14 rounded-3xl overflow-y-scroll md:p-12  authentication-fg mx-4 sm:mx-10">
        <button onClick={handleCloseBtn} className="fixed right-16 top-10">
          <X />
        </button>

        <div className="gap-8 items-start w-full max-w-2xl mx-auto">
          <div>
            {/* <a className="inline-flex items-center mb-3 gap-3 p-1 pr-3 font-bold transition-colors rounded-lg text-offwhite hover:bg-dark-600" data-discover="true" href="/profile/Lily Chen"><span className="relative flex shrink-0 overflow-hidden rounded w-6 h-6"><img className="aspect-square h-full w-full" alt="Lily Chen" src="https://pbs.twimg.com/profile_images/1649086288723623936/61zzuDNO_400x400.jpg"/></span>Lily Chen</a> */}
            <div className="w-full prose prose-invert pb-28">
              <h1
                className="scroll-mt-7 font-sans"
              >
                {title}
              </h1>
              <p>
                <strong>{label}</strong>
              </p>
              <EditorContent editor={editor}/>

              {/* <p>
                <em>
                  Originally published at{" "}
                  <a
                    href="https://medium.com/performance-engineering-for-the-ordinary-barbie/how-the-chrome-profiler-helps-you-understand-javascript-event-loop-92fa6a8bb46a"
                    target="_blank"
                  >
                    medium.com
                  </a>
                  .
                </em>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
