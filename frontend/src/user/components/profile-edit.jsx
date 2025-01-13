import React, { useContext, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../App";
import AnimationWrapper from "../../common/page-animation";

function ProfileEdit({ handleCloseBtn, profile, setUpdateProfile }) {
  let bioLimit = 300;
  let editProfile = useRef();
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  
  const [characterLeft, setCharacterLeft] = useState(bioLimit);
  let {
    personal_info: { fullname, bio, location },
    social_links,
  } = profile;

  const handleCharacterChange = (e) => {
    setCharacterLeft(bioLimit - e.target.value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(editProfile.current);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, location, twitter, github, website, bio } = formData;

    if (bio.length > bioLimit) {
      return toast.error(`Bio must not be exceed ${bioLimit} characters.`);
    }

    let loadingToast = toast.loading("Updating....");
    e.target.setAttribute("disabled", true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/update-profile",
        {
          fullname,
          bio,
          location,
          social_links: { twitter, github, website },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Profile updated");
        setUpdateProfile(true);
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        console.error(err);
      });
  };

  return (
    <AnimationWrapper transition={0.3}>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50">
        <div className=" bg-[#00000080] fixed top-0 bottom-0 left-0 right-0 -z-0">
          <div className="h-full outline-0 overflow-x-hidden overflow-y-auto text-center">
            <div className="relative m-auto max-w-[600px] w-full rounded-3xl overflow-hidden border-2 border-[#a5a5a511]/80 bg-[#212121] md:p-12 p-8">
              <span className="flex items-center gap-2 text-2xl font-bold">
                <Settings /> Edit profile
              </span>
              <p className="mt-2 text-sm text-gray-400">
                All fields are optional.
              </p>
              <form
                ref={editProfile}
                className="grid grid-cols-1 mt-4 gap-y-4 gap-x-4 sm:grid-cols-6"
              >
                <div className="w-full sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-left sm:text-base text-sm font-semibold text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    maxLength="255"
                    className="block w-full p-1 sm:p-2 mt-1 font-[inherit] border-none rounded-md shadow-sm bg-[#a5a5a511] focus:outline-sky-500 outline-none focus:border-sky-500 sm:text-sm md:text-base text-offwhite"
                    defaultValue={fullname}
                  />
                </div>
                <div className="w-full sm:col-span-3">
                  <label
                    htmlFor="location"
                    className="block text-left sm:text-base text-sm font-semibold text-gray-300"
                  >
                    Location{" "}
                  </label>
                  <input
                    type="text"
                    name="location"
                    maxLength="200"
                    defaultValue={location}
                    className="block w-full p-1 sm:p-2 mt-1 font-[inherit] border-none rounded-md shadow-sm bg-[#a5a5a511] focus:outline-sky-500 outline-none focus:border-sky-500 sm:text-sm md:text-base text-offwhite"
                  />
                </div>
                {Object.keys(social_links).map((key, i) => {
                  let link = social_links[key];

                  return (
                    <div
                      key={i}
                      className={`w-full ${
                        key === "website" ? "sm:col-span-6" : "sm:col-span-3"
                      }`}
                    >
                      <label
                        htmlFor="social_links"
                        className=" capitalize block text-left sm:text-base text-sm font-semibold text-gray-300"
                      >
                        {key}{" "}
                      </label>
                      <input
                        type="text"
                        name={key}
                        maxLength="255"
                        defaultValue={link}
                        placeholder=""
                        className="block w-full p-1 sm:p-2 mt-1 font-[inherit] border-none rounded-md shadow-sm bg-[#a5a5a511] focus:outline-sky-500 outline-none focus:border-sky-500 sm:text-sm md:text-base text-offwhite"
                      />
                    </div>
                  );
                })}
                <div className="sm:col-span-6 ">
                  <label
                    htmlFor="bio"
                    className="block text-left sm:text-base text-sm font-semibold text-gray-300"
                  >
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      defaultValue={bio}
                      maxLength={bioLimit}
                      onChange={handleCharacterChange}
                      className="bblock w-full p-1 sm:p-2  mt-1 font-[inherit] border-none rounded-md shadow-sm bg-[#a5a5a511] focus:outline-sky-500 outline-none focus:border-sky-500 sm:text-sm md:text-base text-offwhite"
                    ></textarea>
                    <p className="text-xs font-thin opacity-50 text-right">
                      {characterLeft} characters left
                    </p>
                  </div>
                </div>
                <div className="pt-3 sm:col-span-6">
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-200 hover:bg-[#87858511] bg-[#a5a5a511] text-offwhite cursor-pointer"
                      type="button"
                      onClick={handleCloseBtn}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-offwhite cursor-pointer"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
              <button
                className="absolute top-10 right-10 hover:text-gray-400 duration-300"
                data-testid="close-button"
                onClick={handleCloseBtn}
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default ProfileEdit;
