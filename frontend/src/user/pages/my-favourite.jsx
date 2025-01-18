import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { UserContext } from "../../App";
import PostCard from "../components/post-card";
import Loader from "../../ui/loader";
import Footer from "../components/footer";

export default function MyFavourite(props) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const fetchPosts = async () => {
    props.setProgress(70);
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/favourite-post",
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        props.setProgress(100);
        setPosts(data.posts);
      })
      .catch((err) => {
        props.setProgress(100);
        console.error(err);
      });
  };

  const fetchLoggedUser = async () => {
    if (access_token) {
      await axios
        .get(process.env.REACT_APP_SERVER_DOMAIN + "/logged-user", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, [access_token]);

  useEffect(() => {
    fetchPosts();
  }, [access_token]);

  console.log(posts);

  return (
    <>
    <div className="flex rounded-b-3xl relative max-w-[2200px] m-auto py-0 px-[20px] w-full overflow-clip shadow-b-lg mb-12">
      {/* Sidebar */}
      <div className="z-0 h-[calc(100vh_-_60px)] mr-4 sticky top-14 pt-7 pb-4 hidden xl:block ">
        <div className="w-[200px] flex flex-col h-full ">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-0.5 py-4">
        <h1 className="text-3xl font-bold py-4">My Favourites</h1>

        {!posts.length && (
          <div className="mt-20">
            <Loader size={100} />
          </div>
        )}

        <section className="grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 max-xs:grid-cols-1 max-xs:gap-2.5 grid-cols-elements">
          {posts.map((item, index) => (
            <PostCard
              post={item}
              user={user}
              setProgress={props.setProgress}
              key={index}
            />
          ))}
        </section>
      </div>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>

    </div>
    
    <Footer/>
    </>
  );
}

