// CameraScreen/index.jsx
import React, { useRef, useContext, useState } from "react";
import { Camera } from "react-camera-pro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import withLoading from "../WithLoading";
import { ImageContext } from "../../context/ImageContext";

const CameraScreen = ({ onPhotoTaken }) => {
  const camera = useRef(null);
  const [torchOn, setTorchOn] = useState(false);
  const { setImage } = useContext(ImageContext);

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    onPhotoTaken(photo);
  };

  const toggleTorch = () => {
    const torchStatus = camera.current.toggleTorch();
    setTorchOn(torchStatus);
  };

  return (
    <div className="camera-screen">
      <div className="camera-container">
        <div className="camera-viewfinder">
          <Camera ref={camera} aspectRatio="cover" facingMode="environment" />
        </div>
        <div className="button-container">
          <button className="capture-button" onClick={takePhoto}>
            <FontAwesomeIcon size="3x" icon={faCamera} />
          </button>
          {camera.current?.torchSupported && (
            <button
              className={`torch-button ${torchOn ? "torch-on" : ""}`}
              onClick={toggleTorch}
            >
              <FontAwesomeIcon size="2x" icon={faLightbulb} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLoading(CameraScreen);
