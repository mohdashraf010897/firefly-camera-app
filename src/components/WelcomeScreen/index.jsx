// WelcomeScreen.jsx
import React from "react";
import "./index.css";
import ImageShare from "../Share";
const WelcomeScreen = ({ onTakePicture, onUploadImage, onUploadURL }) => {
  const imageUrl =
    "https://via.placeholder.com/400"; // Replace with your image URL

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
      <div>
      <h1 style={{ textAlign: "center" }}>React Image Share</h1>
      <ImageShare imageUrl={imageUrl} />
    </div>

    </div>
  );
};

export default WelcomeScreen;
