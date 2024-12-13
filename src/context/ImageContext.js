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
  const [prompt, setPrompt] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [proximity, setProximity] = useState(100);
  const [strength, setStrength] = useState(100);
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
      ...settings,
      // Convert [lat, long] array to "long, lat" string
      coordinates: Array.isArray(coords)
        ? `${coords[1]}, ${coords[0]}`
        : coords,
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
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
