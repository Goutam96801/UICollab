import { Linkedin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function AdminBlogCard(blog) {
  function findFirstImage(content) {
    // Parse the JSON content if it's a string
    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;

    // Recursive function to traverse the JSON structure
    function traverse(node) {
      if (node.type === "image" && node.attrs && node.attrs.src) {
        return node.attrs.src; // Return the image source
      }

      if (node.content && Array.isArray(node.content)) {
        for (const childNode of node.content) {
          const result = traverse(childNode);
          if (result) return result; // Return the first image found
        }
      }

      return null; // No image found
    }

    // Start traversing from the root node
    return traverse(parsedContent);
  }

  const src = findFirstImage(blog.blog) || '/defaultBlogImage.png';

  return (
    <article class="relative flex flex-col items-start">
      <Link class="relative w-full" to={`/admin/blogs/${blog.blog.blog_id}`}>
        <img
          src={src}
          alt=""
          class="aspect-[16/9] w-full rounded-2xl bg-gray-700 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-400/10"></div>
      </Link>
      <div class="w-full max-w-xl">
        <div class="flex items-center justify-between w-full mt-4 text-xs gap-x-4">
          <Link
            class="relative z-10 rounded-lg bg-dark-600 px-3 py-1.5 font-medium text-gray-300 hover:bg-dark-500"
            data-discover="true"
            to="/blog/category/UI UX"
          >
            {blog.blog.label}
          </Link>
          <span class="text-gray-400">{blog.blog.activity.total_reads} views</span>
        </div>
        <div class="relative group">
          <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-300">
            <Link
              data-discover="true"
              href="/blog/when-all-we-ever-needed-was-a-text-box"
            >
              <span class="absolute inset-0"></span>{blog.blog.title}
            </Link>
          </h3>
          
        </div>
        
      </div>
    </article>
  );
}

export default AdminBlogCard;
