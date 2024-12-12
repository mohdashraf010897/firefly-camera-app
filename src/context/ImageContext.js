// src/context/ImageContext.js
import React, { createContext, useState } from "react";
import useUUID from "../hooks/useUUID";
import useAPI from "../hooks/useAPI";
import useDeviceLocation from "../hooks/useDeviceLocation";
import { resizeAndCompressImage } from "../utils/imageUtils";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [proximity, setProximity] = useState(50);
  const [strength, setStrength] = useState(50);
  const uuid = useUUID();
  const { coords, locationError, fetchLocation, permissionStatus } =
    useDeviceLocation();
  const { loading, error, callReception, callDelivery, callAdjust } = useAPI();

  const createPayload = (settings = {}) => ({
    client_uuid: uuid,
    settings: {
      proximity,
      strength,
      ...settings,
      coordinates: coords,
    },
  });

  const uploadImage = async (base64Image, settings = {}) => {
    try {
      const resizedImage = await resizeAndCompressImage(base64Image, 800, 600);
      const payload = {
        ...createPayload(settings),
        reference_image: resizedImage,
      };
      const { job_id } = await callReception(payload);
      setJobId(job_id);
      checkDeliveryStatus(job_id);
    } catch (err) {
      console.error("Error uploading image:", err);
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
      } else if (response.error) {
        console.error("Error:", response.error_message);
      } else {
        setTimeout(() => checkDeliveryStatus(job_id), 1000);
      }
    } catch (err) {
      console.error("Error checking delivery status:", err);
    }
  };

  const adjustImage = async (settings = {}) => {
    try {
      const payload = {
        ...createPayload(settings),
        job_id: jobId,
      };
      const { job_id } = await callAdjust(payload);
      setJobId(job_id);
      checkDeliveryStatus(job_id);
    } catch (err) {
      console.error("Error adjusting image:", err);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        image,
        setImage,
        enhancedImage,
        loading,
        error,
        uploadImage,
        adjustImage,
        locationError,
        fetchLocation,
        permissionStatus,
        proximity,
        setProximity,
        strength,
        setStrength,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
