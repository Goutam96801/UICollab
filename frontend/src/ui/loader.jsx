import { motion } from "framer-motion";
import '../utils/loader.css'

export default function Loader({ size }) {
  return (
    <div className="content">
      <div className="column">
        <div className="container animation-6">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
          <div className="shape shape4"></div>
        </div>
      </div>
    </div>
  );
}
