import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { UserContext } from "../../App";
import ProfileDetails from "../components/profile-details";
import ProfileEdit from "../components/profile-edit";
import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../../common/page-animation";
import { removeFromSession } from "../../common/session";
import Loader from "../../ui/loader";
import Footer from "../components/footer";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    profile_img: "",
    username: "",
    bio: "",
    location: "",
  },
  account_info: {
    total_posts: 0,
    total_blogs: 0,
  },
  social_links: {},
  joinedAt: "",
};

function ProfilePage(props) {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const navigate = useNavigate();

  let {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const fetchUserProfile = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (!user || !user.personal_info) {
          setProfile(null); // Handle missing profile
        } else {
          setProfile(user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProfile(null); // Handle error cases
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchUserProfile();
  }, [profileId, updateProfile]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  const handleCloseBtn = () => {
    setOpenEditProfile(false);
  };

  const handleLogout = () => {
    props.setProgress(70);
    setTimeout(() => {
      props.setProgress(100);
      removeFromSession("user");
      setUserAuth({ access_token: null });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="mt-10">
        <Loader size={60} />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">404 - Profile Not Found</h1>
        <p className="text-zinc-400 mb-4">
          The profile you're looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => {
            props.setProgress(70);
            setTimeout(() => {
              props.setProgress(100);
              navigate("/");
            }, 500);
          }}
          className="px-4 py-2 bg-teal-600 rounded-md hover:bg-teal-700 duration-300"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  // Destructure `profile` only if it is valid
  const {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    social_links,
  } = profile;

  return (
    <AnimationWrapper>
      <Toaster />
      <div>
        <div className="min-h-screen bg-transparent text-white p-6">
          <div className="bg-transparent p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-64 h-64 rounded-lg overflow-hidden bg-zinc-800">
                <img
                  src={profile_img}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="lg:text-4xl text-2xl font-bold">
                      {fullname}
                    </h1>
                    <p className="text-zinc-400">@{profile_username}</p>
                  </div>
                  {profileId === username ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOpenEditProfile(true)}
                        className="px-3 py-1 text-sm text-zinc-400 border border-zinc-700 rounded-md flex items-center hover:bg-zinc-800"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1 text-sm text-zinc-400 border border-zinc-700 rounded-md flex items-center hover:bg-zinc-800"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="mb-4 font-semibold text-lg">{bio}</p>
                <div className="flex items-center flex-wrap gap-6 text-sm text-zinc-400">
                  {Object.keys(social_links).map((key) => {
                    let link = social_links[key];

                    return link ? (
                      <Link
                        key={key}
                        className="capitalize text-lg hover:text-white duration-300 flex items-center"
                        target="_blank"
                        to={link}
                      >
                        {key === "website" ? (
                          <i className="w-[16px] h-[22px] fi fi-br-link-alt mr-2"></i>
                        ) : (
                          <i
                            className={`w-[16px] h-[22px] mr-2 fi fi-brands-${key}`}
                          ></i>
                        )}
                        {key}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <ProfileDetails setProgress={props.setProgress} />
        </div>
        {openEditProfile ? (
          <ProfileEdit
            profile={profile}
            handleCloseBtn={handleCloseBtn}
            setUpdateProfile={setUpdateProfile}
          />
        ) : null}
      </div>
      <Footer/>
    </AnimationWrapper>
  );
}

export default ProfilePage;
