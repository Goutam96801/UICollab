import { Link2, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";

function ImageUploader({ onImageUpload }) {
  const [uploadMethod, setUploadMethod] = useState("local");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageUpload(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const handleUrlSubmit = useCallback(() => {
    if (imageUrl) {
      onImageUpload(imageUrl);
    }
  }, [imageUrl, onImageUpload]);

  return (
    <div className="space-y-4 ">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            uploadMethod === "local" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
          onClick={() => setUploadMethod("local")}
        >
          <Upload size={18} />
          Local Upload
        </button>
        <button
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            uploadMethod === "url" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
          onClick={() => setUploadMethod("url")}
        >
          <Link2 size={18} />
          URL
        </button>
      </div>
      {uploadMethod === "local" ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      ) : (
        <div className="flex space-x-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-grow px-4 py-2 rounded-lg bg-gray-900 outline-none border border-gray-500 focus:bg-gray-800"
          />
          <button
            onClick={handleUrlSubmit}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
