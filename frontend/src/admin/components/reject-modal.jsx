import { Ban } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../App';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import toast from 'react-hot-toast';

function PostRejectAlert({postId, rejectmodal, setRejectModal}) {

    let { adminAuth: {access_token}} = useContext(AdminContext);
    const [progress, setProgress] = useState(0);

    const handleRejectBtn = async () => {
        setProgress(70);
        await axios
          .post(
            process.env.REACT_APP_SERVER_DOMAIN + "/admin/update-post",
            { postId: postId, status: "rejected" },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(() => {
            setProgress(100);
            toast.success("success");
            setRejectModal(false)
          })
          .catch((err) => {
            console.log(err);
            setProgress(100);
          });
      };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
     <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    <div 
    //   ref={modalRef}
      tabIndex={-1}
      className="bg-[#212121] p-6 rounded-lg shadow-lg max-w-sm w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title" className="text-xl font-bold mb-4">Confirm Rejection</h2>
      <p className="mb-6">Once rejected, you won't be able to do anything with this post. Proceed?</p>
      <div className="flex justify-end space-x-4">
        <button onClick={() => setRejectModal(false)}
        //   onClick={closeModal}
          className="px-4 py-2 duration-300 rounded font-semibold hover:bg-[#a5a5a511]"
        >
          Cancel
        </button>
        <button onClick={handleRejectBtn}
        //   onClick={submitPostForReview}
          className="px-4 flex gap-1 py-2 bg-red-500 text-white font-semibold rounded duration-300 hover:bg-red-600"
        >
            <Ban/>
          Reject
        </button>
      </div>
    </div>
  </div>
  )
}

export default PostRejectAlert
