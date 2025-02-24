import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import "../../utils/editor.css";
import axios from "axios";
import { AdminContext } from "../../App";

function BlogDetails() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({});
  const navigate = useNavigate();
  let {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const fetchBlog = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin-get-blog",
        { blogId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setBlog(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [access_token, blogId]);

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
    content: "",
    editable: false,
  });
  useEffect(() => {
    if (editor && blog.content) {
      editor.commands.setContent(blog.content);
    }
  }, [editor, blog.content]);
  if (!editor) {
    return null;
  }

  function getDomain(url) {
    try {
        let hostname = new URL(url).hostname;
        let parts = hostname.split('.').slice(-2); // Get last two parts (e.g., uiverse.io)
        return parts.join('.');
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

  return (
    <div className="px-5 py-0 data-[path='/']:px-0 root-container relative mb-12 border-b-2 border-dark-300 shadow-[rgba(0,_0,_0,_0.1)_0px_20px_25px_-5px,_rgba(0,_0,_0,_0.04)_0px_10px_10px_-5px]">
      <div></div>
      <div className="outlet-wrapper z-10">
        <div className="px-6 pt-6 lg:px-8">
          <div className="mx-auto text-base leading-7 text-gray-300">
            <div className="flex max-w-2xl mx-auto flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-2 -ml-3">
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-700 rounded-xl flex items-center gap-1 hover:bg-gray-800 duration-300">
                  <ArrowLeft size={20} />
                  Go back
                </button>
              </div>
              <button onClick={() => {
                navigate(`/admin/blog/edit/${blogId}`)
              }} className="px-4 py-2 bg-gray-700 rounded-xl flex items-center gap-1 hover:bg-gray-800 duration-300">
                <Settings size={20} />
                Go to editor mode{" "}
              </button>
            </div>
            <div className="gap-8 items-start w-full max-w-2xl mx-auto">
              <div>
                <div className="w-full pb-28">
                  <h1 className="scroll-mt-7 font-sans text-4xl font-bold">
                    {blog.title}
                  </h1>
                  <p className="py-2 opacity-50">
                    <strong>{blog.label}</strong>
                  </p>
                  <div className="prose prose-invert ">
                    <EditorContent editor={editor} />
                  </div>

                  {!blog.isOriginal && (
                    <p className="my-4">
                      <em>
                        Originally published at{" "}
                        <a href={blog?.sourceLink} target="_blank">
                          {getDomain(blog?.sourceLink)}
                        </a>
                        .
                      </em>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
