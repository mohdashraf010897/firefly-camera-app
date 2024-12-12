// CameraApp/index.jsx
import React, { useState, useEffect, useContext } from "react";
import WelcomeScreen from "../WelcomeScreen";
import CameraScreen from "../CameraScreen";
import UploadImageScreen from "../UploadImageScreen";
import UploadURLScreen from "../UploadURLScreen";
import PreviewScreen from "../PreviewScreen";
import { ImageProvider, ImageContext } from "../../context/ImageContext";
import { ThemeProvider } from "../../context/ThemeContext";
import Wrapper from "./Wrapper";
import { USE_DIRECT_CAMERA } from "../../config";
import "./index.css";

const CameraApp = () => {
  const [screen, setScreen] = useState(
    USE_DIRECT_CAMERA ? "camera" : "welcome"
  );

  const handleTakePicture = () => {
    setScreen("camera");
  };

  const handleUploadImage = () => {
    setScreen("uploadImage");
  };

  const handleUploadURL = () => {
    setScreen("uploadURL");
  };

  const handleRegenerate = () => {
    setScreen("uploadImage");
  };

  return (
    <ThemeProvider>
      <ImageProvider>
        <Wrapper screen={screen} setScreen={setScreen}>
          <AppContent
            screen={screen}
            setScreen={setScreen}
            handleTakePicture={handleTakePicture}
            handleUploadImage={handleUploadImage}
            handleUploadURL={handleUploadURL}
            handleRegenerate={handleRegenerate}
          />
        </Wrapper>
      </ImageProvider>
    </ThemeProvider>
  );
};

const AppContent = ({
  screen,
  setScreen,
  handleTakePicture,
  handleUploadImage,
  handleUploadURL,
  handleRegenerate,
}) => {
  const {
    loading,
    enhancedImage,
    uploadImage,
    image: uploadedImage,
  } = useContext(ImageContext);
  console.log("🚀 ~ uploadedImage:", uploadedImage);

  useEffect(() => {
    if (screen !== "preview" && enhancedImage && uploadedImage) {
      setScreen("preview");
    }
  }, [enhancedImage, setScreen, screen, uploadedImage]);

  return (
    <div className="App">
      {screen === "welcome" && !USE_DIRECT_CAMERA && (
        <WelcomeScreen
          onTakePicture={handleTakePicture}
          onUploadImage={handleUploadImage}
          onUploadURL={handleUploadURL}
        />
      )}
      {screen === "camera" && (
        <CameraScreen
          isLoading={loading}
          onPhotoTaken={(photo) => {
            uploadImage(photo);
          }}
        />
      )}
      {screen === "uploadImage" && !USE_DIRECT_CAMERA && (
        <UploadImageScreen
          isLoading={loading}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "uploadURL" && !USE_DIRECT_CAMERA && (
        <UploadURLScreen
          isLoading={loading}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "preview" && (
        <PreviewScreen
          isLoading={loading}
          onBack={() => setScreen(USE_DIRECT_CAMERA ? "camera" : "uploadImage")}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

export default CameraApp;
