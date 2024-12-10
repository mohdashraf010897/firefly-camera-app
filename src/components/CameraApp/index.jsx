// CameraApp/index.jsx
import React, { useState, useEffect, useContext } from "react";
import WelcomeScreen from "../WelcomeScreen";
import CameraScreen from "../CameraScreen";
import UploadImageScreen from "../UploadImageScreen";
import UploadURLScreen from "../UploadURLScreen";
import PreviewScreen from "../PreviewScreen";
import { ImageProvider, ImageContext } from "../../context/ImageContext";
import "./index.css";

const CameraApp = () => {
  const [screen, setScreen] = useState("welcome");

  const handleTakePicture = () => {
    setScreen("camera");
  };

  const handleUploadImage = () => {
    setScreen("uploadImage");
  };

  const handleUploadURL = () => {
    setScreen("uploadURL");
  };

  const handlePhotoTaken = (photo) => {
    // Handle the photo taken logic here
    console.log("Photo taken:", photo);
  };

  const handleBack = () => {
    setScreen("welcome");
  };

  const handleRegenerate = () => {
    setScreen("uploadImage");
  };

  return (
    <ImageProvider>
      <AppContent
        screen={screen}
        setScreen={setScreen}
        handleTakePicture={handleTakePicture}
        handleUploadImage={handleUploadImage}
        handleUploadURL={handleUploadURL}
        handlePhotoTaken={handlePhotoTaken}
        handleBack={handleBack}
        handleRegenerate={handleRegenerate}
      />
    </ImageProvider>
  );
};

const AppContent = ({
  screen,
  setScreen,
  handleTakePicture,
  handleUploadImage,
  handleUploadURL,
  handlePhotoTaken,
  handleBack,
  handleRegenerate,
}) => {
  const { loading, enhancedImage } = useContext(ImageContext);

  useEffect(() => {
    if (enhancedImage) {
      setScreen("preview");
    }
  }, [enhancedImage, setScreen]);

  return (
    <div className="App">
      {screen === "welcome" && (
        <WelcomeScreen
          onTakePicture={handleTakePicture}
          onUploadImage={handleUploadImage}
          onUploadURL={handleUploadURL}
        />
      )}
      {screen === "camera" && <CameraScreen onPhotoTaken={handlePhotoTaken} />}
      {screen === "uploadImage" && (
        <UploadImageScreen isLoading={loading} onBack={handleBack} />
      )}
      {screen === "uploadURL" && (
        <UploadURLScreen isLoading={loading} onBack={handleBack} />
      )}
      {screen === "preview" && (
        <PreviewScreen onBack={handleBack} onRegenerate={handleRegenerate} />
      )}
    </div>
  );
};

export default CameraApp;
