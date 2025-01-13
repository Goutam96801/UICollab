import axios from "axios";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";

function ReportModal({postId, access_token, handleCloseBtn}) {
  const reportObject = [
    {
      title: "Misleading or Inappropriate Content",
      description:
        "Select this if this post contains false, misleading, or inappropriate information that may deceive users or promote harmful actions",
    },
    {
      title: "Copyright Violation",
      description:
        "Choose this if you believe this post infringes on someone's intellectual property or copyrighted content",
    },
    {
      title: "Spam or Malicious Content",
      description:
        "Report this if this post seems to be spam, promotes phishing, or contains malicious intent or links",
    },
    {
      title: "Other",
      description:
        "If your reason doesn't fit the categories above, select this and provide more details in the subsequent field",
    },
  ];
  const [reportMessage, setReportMessage] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");

  const handleReportSubmit = async () => {

    await axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/report-post', {post_id:postId, message:reportMessage, additionalMessage}, {
        headers:{
            Authorization:`Bearer ${access_token}`
        }
    }).then((report) => {
        toast.success("Reported Successfully.")
    }).catch(({response})=>{
        toast.error(response.data.error)
    })
  }

  return (
    <AnimationWrapper transition={0.5}>
    <div className="fixed top-0 left-0 bottom-0 right-0 z-[1000]">
        <Toaster/>
      <div className="bg-[#00000080] fixed top-0 left-0 bottom-0 right-0 z-[-1]"></div>
      <div className="h-[100%] outline-none overflow-x-hidden overflow-y-auto text-center">
        <div className="relative m-auto w-full p-16 border-dark-600/80 border-2 rounded-3xl bg-[#1b1b1b] max-w-[700px]">
          <div>
            <div className="mb-4 text-2xl font-bold text-gray-300">
              Report post
            </div>
            <div className="py-4 bg-[#1b1b1b]">
              <div>
                <div className="-space-y-[2px] rounded-md">
                  {reportObject.map((report, index) => (
                    <div
                      onClick={() => setReportMessage(report.title)}
                      key={index}
                      className={`z-10 rounded-tl-md rounded-tr-md relative flex cursor-pointer border p-4 focus:outline-none ${
                        reportMessage === report.title
                          ? "border-purple-500 bg-[#2c2c2c]"
                          : "border-[#212121]"
                      }`}
                    >
                      <span
                        className={` mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center ${
                          reportMessage === report.title
                            ? "bg-purple-700 border-transparent"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <span className="rounded-full bg-white w-1.5 h-1.5"></span>
                      </span>
                      <span className="flex flex-col ml-3">
                        <span className="text-gray-300 block text-sm font-semibold">
                          {report.title}
                        </span>
                        <span
                          className="text-gray-400 block text-sm"
                          id="headlessui-description-:rec:"
                          data-headlessui-state=""
                        >
                          {report.description}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
              <label
                htmlFor="comment"
                className="block text-sm font-semibold leading-6 text-gray-200"
              >
                Write anything that will help us verify your claim. For example,
                add links.
              </label>
              <div className="mt-2">
                <textarea
                  rows="4"
                  name="comment"
                  value={additionalMessage}
                  onChange={(e) =>setAdditionalMessage(e.target.value)}
                  className="block w-full rounded-md border-0 p-2 bg-[#202020] text-gray-200 shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-purple-400 sm:text-sm sm:leading-6"
                ></textarea>
              </div>
              <button
              onClick={handleReportSubmit}
                className={`px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-offwhite cursor-pointer mt-3 ml-auto`}
                type="submit"
              >
                Submit
              </button>
          </div>
          <button className="absolute top-4 right-4 p-0 cursor-pointer bg-transparent hover:opacity-70 duration-300 flex" onClick={handleCloseBtn}>
            <X width={30} height={30} />
          </button>
        </div>
      </div>
    </div>
    </AnimationWrapper>
  );
}

export default ReportModal;
