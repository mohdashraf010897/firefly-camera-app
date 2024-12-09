// CameraScreen.jsx
import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faSyncAlt,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const CameraScreen = ({ onPhotoTaken }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [torchOn, setTorchOn] = useState(false);

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    onPhotoTaken(photo);
  };

  const switchCamera = () => {
    const newFacingMode = camera.current.switchCamera();
    setFacingMode(newFacingMode);
  };

  const toggleTorch = () => {
    const torchStatus = camera.current.toggleTorch();
    setTorchOn(torchStatus);
  };

  return (
    <div className="camera-screen">
      <div className="camera-container">
        <Camera
          ref={camera}
          aspectRatio="cover"
          facingMode={facingMode}
          numberOfCamerasCallback={setNumberOfCameras}
        />
        <div className="button-container">
          <button className="capture-button" onClick={takePhoto}>
            <FontAwesomeIcon size="2x" icon={faCamera} />
          </button>
          {numberOfCameras > 1 && (
            <button className="switch-button" onClick={switchCamera}>
              <FontAwesomeIcon size="2x" icon={faSyncAlt} />
            </button>
          )}
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
      {image && <img src={image} alt="captured img" />}
    </div>
  );
};

export default CameraScreen;
