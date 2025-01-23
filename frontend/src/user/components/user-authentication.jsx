import { useContext, useState } from "react";
import AstronautImage from "../../assets/astronaut.png";
import GoogleIcon from "../../assets/icon-google.svg";
import { X } from "lucide-react";
import { authWithGithub, authWithGoogle } from "../../common/firebase";
import { storeInSession } from "../../common/session";
import { UserContext } from "../../App";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserAuthentication({ handleCloseBtn }) {
  const [isSignIn, setIsSignIn] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    if (!setAgreeTerms) {
      e.target.classList.add("disabled");
    }

    authWithGoogle()
      .then(async (user) => {
        let formData = {
          access_token: user.accessToken,
        };

        await axios
          .post(process.env.REACT_APP_SERVER_DOMAIN + "/google-auth", formData)
          .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
          })
          .catch(({ response }) => {
            const errorMessage = response?.data?.error || "An error occurred";
            toast.error(errorMessage);
          });
      })
      .catch((err) => {
        toast.error("trouble login through google");
      });
  };

  const handleGithubAuth = (e) => {
    e.preventDefault();

    authWithGithub()
      .then(async (user) => {
        let formData = {
          access_token: user.accessToken,
        };

        await axios
          .post(process.env.REACT_APP_SERVER_DOMAIN + "/github-auth", formData)
          .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
          })
          .catch(({ response }) => {
            const errorMessage = response?.data?.error || "An error occured";
            toast.error(errorMessage);
          });
      })
      .catch((err) => {
        toast.error("Trouble logging in through GitHub");
      });
  };

  return access_token ? (
    handleCloseBtn()
  ) : (
    <div className="z-50 authentication-bg transition-all duration-300 ">
      <div className=" block relative max-w-[650px] w-full bg-dark-700 p-8 py-14 rounded-3xl overflow-hidden md:p-12  authentication-fg mx-4 sm:mx-10">
        <div className="font-semibold modal relative z-10">
          <button className="absolute right-0 -top-8" onClick={handleCloseBtn}>
            <X />
          </button>
          <div className="mb-6 text-3xl font-bold text-center text-offwhite font-display">
            Sign in or Create Account
          </div>
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  className={`border-indigo-400  bg-transparent font-semibold cursor-pointer w-1/2 py-4 px-1 text-center text-base ${
                    !isSignIn ? "border-b-2 text-indigo-400" : ""
                  }`}
                  onClick={() => setIsSignIn(false)}
                >
                  Create Account
                </button>
                <button
                  className={`border-indigo-400  bg-transparent font-semibold cursor-pointer w-1/2 py-4 px-1 text-center text-base ${
                    isSignIn ? "border-b-2 text-indigo-400" : ""
                  }`}
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </button>
              </nav>
            </div>
          </div>
          <div className="min-h-[170px] pt-8">
            <div className="flex flex-col items-center">
              {!isSignIn && (
                <div>
                  <p className="text-base text-center text-gray-200 mb-3">
                    You will get a profile and access to more awesome features.
                  </p>
                  <label
                    className="flex items-center justify-center text-offwhite gap-2 cursor-pointer select-none"
                    htmlFor="agree"
                  >
                    <div className="flex h-6 items-center">
                      <input
                        id="agree"
                        onChange={handleCheckboxChange}
                        checked={agreeTerms}
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-dark-600 text-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="">
                      I agree with{" "}
                      <a
                        href=""
                        target="_blank"
                        className="text-base text-center text-gray-400 underline"
                      >
                        Terms and Condition
                      </a>{" "}
                      and{" "}
                      <a
                        href=""
                        target="_blank"
                        className="text-base text-center text-gray-400 underline"
                      >
                        Privacy Policy
                      </a>
                    </div>
                  </label>
                </div>
              )}
              <div className="inline-flex flex-col gap-4 mt-4 mx-auto">
                <button
                  className={`px-4 py-2.5 font-sans items-center gap-2 border-none rounded-lg text-white font-semibold transition-colors duration-200 bg-[#a5a5a511] flex w-full hover:bg-[#212121] ${
                    !isSignIn && !agreeTerms
                      ? "pointer-events-none  opacity-50"
                      : ""
                  }`}
                  onClick={handleGoogleAuth}
                >
                  <img src={GoogleIcon} alt="icon" width={20} />
                  Continue with Google
                </button>
                <button
                  className={`px-4 py-2.5 font-sans items-center gap-2 border-none rounded-lg text-white font-semibold transition-colors duration-200 bg-[#a5a5a511] flex w-full hover:bg-[#212121] ${
                    !isSignIn && !agreeTerms
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  onClick={handleGithubAuth}
                >
                  <img
                    src="/github-mark-white.svg"
                    alt="GitHub Icon"
                    width={20}
                  />
                  Continue with GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block image-container w-36 h-36 rotate-[15deg] absolute top-0 -left-0 ease-in transition-all hover:rotate-[0deg] hover:translate-x-3 hover:scale-105">
          <div className="relative animation-auth">
            <img
              src="/rocket.png"
              alt=""
              width={120}
              height={120}
              className="absolute z-0 rocket"
            />
            <img
              src="/coin.png"
              alt=""
              width={120}
              height={120}
              className="absolute top-0 -left-1 -z-10 coin"
            />
            <img
              src="/spring.png"
              alt=""
              width={120}
              height={120}
              className="absolute spring"
            />
            <img
              src="/stars.png"
              alt=""
              width={120}
              height={120}
              className="absolute star"
            />
            <img
              src="/cloud.png"
              alt=""
              width={120}
              height={120}
              className="absolute cloud"
            />
            <img
              src="/dots.png"
              alt=""
              width={120}
              height={120}
              className="absolute dots"
            />
            <img
              src="\white-outline.png"
              alt="White Outline"
              width={160}
              height={160}
              className="absolute -left-[13px] -top-[14px] white-outline"
            />
          </div>
        </div>
        <div className="max-w-[1600px] w-full z-50 rounded-full h-[366px] bg-gradient-to-b from-purple-400 from-50% via-50% to-100%  via-teal-400 to-transparent absolute bg-opacity-30 left-1/2 -translate-x-1/2 top-[-300px] blur-[100px]"></div>
      </div>
    </div>
  );
}
