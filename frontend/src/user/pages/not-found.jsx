import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";
import { ArrowLeftIcon } from "lucide-react";
import Footer from "../components/footer";

const NotFound = (props) => {
    const navigate = useNavigate()
  return (
    <AnimationWrapper>
      <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#212121]">
        <h1 className="text-6xl font-bold  mb-4">404</h1>
        <p className="text-2xl mb-8">Oops! Page not found.</p>
        <button
          onClick={() => {
            props.setProgress(70);
            setTimeout(() => {
              props.setProgress(100);
              navigate("/");
            }, 500);
          }}
          className="flex gap-1 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-300"
        >
          <ArrowLeftIcon />
          Go back to home
        </button>
      </div>
      <Footer/>
    </AnimationWrapper>
  );
};

export default NotFound;
