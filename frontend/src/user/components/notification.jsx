import React, { useContext, useEffect, useState } from "react";
import { Bell, Check, Info } from "lucide-react";
import AnimationWrapper from "../../common/page-animation";
import axios from "axios";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function Notifications({
  totalNotifications,
  setTotalNotifications,
}) {
  const [notifications, setNotifications] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [markLoading, setMarkLoading] = useState(false);
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const limit = 5;

  const fetchNotification = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/notifications",
        { skip: notifications.length, limit },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const notificationsData = response.data?.notification || [];

      setNotifications((prev) => [
        ...prev,
        ...notificationsData.filter(
          (item) => !prev.some((prevItem) => prevItem._id === item._id)
        ),
      ]);

      // Check if there are more notifications to load
      setHasMore(notificationsData.length === limit);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  const markAsReadBtn = async () => {
    setMarkLoading(true);
    try {
      await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/mark-all-notifications-as-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Update the notifications state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          seen: true, // Mark all as seen
        }))
      );
      setTotalNotifications(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setMarkLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <AnimationWrapper transition={0.5} >
      <div className="absolute right-0 top-11 mt-2 w-96 max-h-[calc(100vh-200px)] bg-[#18181b] border border-gray-800 rounded-lg shadow-lg overflow-scroll">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white flex gap-1">
              Notifications
              <p className="text-sm text-purple-600 font-medium">
                ({totalNotifications})
              </p>
            </h2>
          </div>

          {markLoading ? (
            <ClipLoader size={10} />
          ) : (
            <button
              onClick={markAsReadBtn}
              className="text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              title="Mark all as read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="px-2">
          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader />
            </div>
          )}
          {!notifications.length && (
            <div className="text-center text-gray-400 py-4">
              No notifications
            </div>
          )}
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                notification.seen ? "opacity-50" : ""
              }`}
            >
              {notification.user ? (
                <Link
                  to={`/profile/${notification.user.personal_info.username}`}
                  className="h-12 w-12 rounded-lg bg-[#8B5CF6] flex items-center justify-center flex-shrink-0"
                >
                  <img
                    src={notification.user.personal_info.profile_img}
                    className="h-12 w-12 rounded-lg"
                  />
                </Link>
              ) : (
                <div className="h-12 w-12 rounded-lg bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-white" />
                </div>
              )}

              <div className="flex-1">
                <p className="text-sm text-white mb-1">
                  <span className="font-normal">{notification.message}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center my-2">
              <button
                onClick={fetchNotification}
                disabled={loading}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded text-sm"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
}
