// src/context/ImageContext.js
import React, { createContext, useState, useContext } from "react";
import useUUID from "../hooks/useUUID";
import useAPI from "../hooks/useAPI";
import useDeviceLocation from "../hooks/useDeviceLocation";
import { resizeAndCompressImage } from "../utils/imageUtils";
import { ErrorContext } from "./ErrorContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState(null);
  const [proximity, setProximity] = useState(100);
  const [strength, setStrength] = useState(100);
  const [orientation, setOrientation] = useState("portrait");
  const uuid = useUUID();
  const { coords, locationError, fetchLocation, permissionStatus } =
    useDeviceLocation();
  const { loading, setLoading, callReception, callDelivery, callAdjust } =
    useAPI();
  const { setError } = useContext(ErrorContext);

  const createPayload = (settings = {}) => ({
    client_uuid: uuid,
    settings: {
      proximity,
      strength,
      orientation,
      ...settings,
      coordinates: Array.isArray(coords)
        ? `${coords[1]}, ${coords[0]}`
        : coords,
    },
  });

  const detectOrientation = (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isLandscape = img.width > img.height;
        setOrientation(isLandscape ? "landscape" : "portrait");
        resolve(imageData);
      };
      img.src = imageData;
    });
  };

  const uploadImage = async (imageData, settings = {}) => {
    try {
      await detectOrientation(imageData);
      setLoading(true);

      // Convert base64 to proper format if needed
      let processedImage = imageData;
      if (
        typeof imageData === "string" &&
        !imageData.startsWith("data:image")
      ) {
        processedImage = `data:image/jpeg;base64,${imageData}`;
      }

      // Resize the image
      const resizedImage = await resizeAndCompressImage(processedImage);

      // Create payload
      const payload = {
        ...createPayload(settings),
        reference_image: resizedImage,
      };

      const { job_id } = await callReception(payload);
      setJobId(job_id);
      checkDeliveryStatus(job_id);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const checkDeliveryStatus = async (job_id) => {
    try {
      const payload = {
        client_uuid: uuid,
        job_id,
      };
      const response = await callDelivery(payload);
      if (response.download_url) {
        setEnhancedImage(response.download_url);
        setPrompt(response.prompt);
        setLoading(false);
      } else if (response.error) {
        console.error("Error:", response.error_message);
        setError(response.error_message);
        setLoading(false);
      } else if (response.jobNotFinished) {
        setTimeout(() => checkDeliveryStatus(job_id), 5000);
      } else {
        console.error("Unexpected response");
        setError("Unexpected response");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error checking delivery status:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const adjustImage = async (settings = {}) => {
    try {
      const payload = {
        ...createPayload(settings),
        job_id: jobId,
      };
      const response = await callAdjust(payload);
      if (response.job_id) {
        setJobId(response.job_id);
        checkDeliveryStatus(response.job_id);
      } else if (response.error) {
        console.error("Error:", response.error_message);
        setError(response.error_message);
        setLoading(false);
      } else {
        console.error("Unexpected response");
        setError("Unexpected response");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error adjusting image:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const setValidProximity = (value) => {
    setProximity(Math.max(1, Math.min(100, value)));
  };

  const setValidStrength = (value) => {
    setStrength(Math.max(1, Math.min(100, value)));
  };

  const resetState = () => {
    setImage(null);
    setEnhancedImage(null);
    setPrompt("");
    setProximity(50);
    setStrength(50);
  };

  return (
    <ImageContext.Provider
      value={{
        image,
        setImage,
        enhancedImage,
        prompt,
        loading,
        uploadImage,
        adjustImage,
        locationError,
        fetchLocation,
        permissionStatus,
        proximity,
        setProximity: setValidProximity,
        strength,
        setStrength: setValidStrength,
        setPrompt,
        resetState,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
