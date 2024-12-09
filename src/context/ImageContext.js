// context/ImageContext.js
import React, { createContext, useState } from "react";
import { enhanceImage } from "../api";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (imageData) => {
    setLoading(true);
    try {
      const { enhancedImage = undefined } = await enhanceImage(imageData);
      console.log("🚀 ~ uploadImage ~ enhanced:", enhancedImage);
      console.log("🚀 ~ uploadImage ~ imageData:", imageData);
      setEnhancedImage(enhancedImage);
    } catch (error) {
      console.error("Error enhancing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageContext.Provider
      value={{ image, setImage, enhancedImage, loading, uploadImage }}
    >
      {children}
    </ImageContext.Provider>
  );
};
