import React, { useEffect, useState } from "react";
import { Bolt, Star, Trophy, User } from "lucide-react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import PostCard from "../components/post-card";
import { Link } from "react-router-dom";

const Feature = (props) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchTrendingPost = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/top-post-from-last-week")
      .then(({ data }) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTopCreators = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/top-creators")
      .then(({ data }) => {
        setUsers(data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTrendingPost();
    fetchTopCreators();
  }, []);

  const topCreators = [
    { id: 1, name: "CSSWizard", posts: 45, totalLikes: 12000 },
    { id: 2, name: "AnimationKing", posts: 38, totalLikes: 10500 },
    { id: 3, name: "LayoutMaster", posts: 41, totalLikes: 9800 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b0764,transparent)]" />
      </div> */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Featured Posts
            </h1>
            <p className="text-xl text-gray-300">
              Celebrating this week's top posts and creators
            </p>
          </header>

          <section className="mb-16 animate-fade-in animation-delay-300">
            <h2 className="text-4xl font-semibold mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              <Trophy className="mr-2 text-blue-400 glow" /> Weekly Top Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.length === 0 ? (
                <ClipLoader />
              ) : (
                posts.map((post, index) => <PostCard post={post} user={post.user} setProgress={props.setProgress} key={index}/>)
              )}
            </div>
          </section>

          <section className="animate-fade-in animation-delay-600">
            <h2 className="text-4xl font-semibold mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              <Star className="mr-2 text-blue-400 glow" /> Top Creators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {users.length === 0 ? (
                <ClipLoader />
              ) : (
                users.map((user, index) => (
                  <Link
                    to={`/profile/${user.personal_info.username}`}
                    key={index}
                    className="bg-gray-900 rounded-lg p-6 items-center flex transform transition-all duration-300 hover:bg-opacity-50 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex flex-row items-center gap-3">
                      <img
                        src={user?.personal_info?.profile_img}
                        alt=""
                        className="w-12 h-12 rounded-lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {user.personal_info.username}
                        </h3>
                        <div className="flex items-center gap-3">
                          <p className="py-1  font-semibold text-gray-200 rounded-full whitespace-nowrap font-sm">
                            {user.account_info.total_posts} posts
                          </p>
                          <div data-orientation="vertical" role="none" className="shrink-0 bg-gray-500 w-[1px] h-4"></div>
                          <p className="py-1 flex gap-1 items-center font-semibold text-gray-200 rounded-full whitespace-nowrap font-sm">
                            <Bolt size={20} className="text-purple-600"/>
                            {user.account_info.contributor_points}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>
    </div>
  );
};

export default Feature;
