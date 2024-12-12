// WelcomeScreen.jsx
import React from "react";
import "./index.css";
import GeolocationComponent from "../GeoLocation";
const WelcomeScreen = ({ onTakePicture, onUploadImage, onUploadURL }) => {
  return (
    <div className="welcome-screen">
      <h1>Adobe FireflyCam</h1>
      <h2>Welcome to the Firefly Camera App</h2>
      <div className="cta-container">
        <button className="cta-button" onClick={onTakePicture}>
          Take a picture
        </button>
        <button className="cta-button" onClick={onUploadImage}>
          Upload image
        </button>
        <button className="cta-button" onClick={onUploadURL}>
          Upload via URL
        </button>
      </div>
      <GeolocationComponent/>
    </div>
  );
};

export default WelcomeScreen;
