import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import { Settings, LogOut } from "lucide-react";
import { UserContext } from "../../App";
import ProfileDetails from "../components/profile-details";
import ProfileEdit from "../components/profile-edit";
import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../../common/page-animation";
import LoadingBar from "react-top-loading-bar";

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

function ProfilePage() {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    // account_info: { total_blogs, total_posts },
    social_links,
    // joinedAt,
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserContext);

  const fetchUserProfile = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        setProfile(user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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

  return (
    <AnimationWrapper>
      <Toaster />
      <LoadingBar
        color="#7781b7"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="z-50"
      />
      {loading ? (
        <GridLoader
          color="indigo"
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
        />
      ) : (
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
                        <button className="px-3 py-1 text-sm text-zinc-400 border border-zinc-700 rounded-md flex items-center hover:bg-zinc-800">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log out
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
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
                          {key == "website" ? (
                            <i className="w-[16px] h-[22px] fi fi-br-link-alt mr-2"></i>
                          ) : (
                            <i
                              className={`w-[16px] h-[22px] mr-2 fi fi-brands-${key}`}
                            ></i>
                          )}
                          {key}
                        </Link>
                      ) : (
                        " "
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <ProfileDetails setProgress={setProgress} />
          </div>
          {openEditProfile ? (
            <ProfileEdit
              profile={profile}
              handleCloseBtn={handleCloseBtn}
              setUpdateProfile={setUpdateProfile}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </AnimationWrapper>
  );
}

export default ProfilePage;
