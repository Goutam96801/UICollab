import { motion } from "framer-motion";
import '../utils/loader.css';


export default function Loader({ size = 50 }) {
  const shapeSize = size * 0.24; // Adjust the shape size relative to the container size
  const shapeRadius = shapeSize * 0.2; // Adjust the border-radius relative to the shape size

  return (
    <div className="content">
      <div className="column">
        <div
          className="container animation-6"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <div
            className="shape shape1"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
              borderRadius: `${shapeRadius}px`,
            }}
          ></div>
          <div
            className="shape shape2"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
              borderRadius: `${shapeRadius}px`,
            }}
          ></div>
          <div
            className="shape shape3"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
              borderRadius: `${shapeRadius}px`,
            }}
          ></div>
          <div
            className="shape shape4"
            style={{
              width: `${shapeSize}px`,
              height: `${shapeSize}px`,
              borderRadius: `${shapeRadius}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
