// src/context/ImageContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import useUUID from "../hooks/useUUID";
import useAPI from "../hooks/useAPI";
import useDeviceLocation from "../hooks/useDeviceLocation";
import useDeviceOrientation from "../hooks/useDeviceOrientation";
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
  const [manualCoords, setManualCoords] = useState(null);
  console.log("🚀 ~ ImageProvider ~ manualCoords:", manualCoords);
  const uuid = useUUID();
  const {
    coords: deviceCoords,
    locationError,
    fetchLocation,
    permissionStatus,
  } = useDeviceLocation();

  const coords = manualCoords || deviceCoords;

  const handleSetManualCoords = (coordString) => {
    if (!coordString) {
      setManualCoords(null);
      return;
    }
    const [longitude, latitude] = coordString
      .split(",")
      .map((c) => parseFloat(c.trim()));
    setManualCoords([latitude, longitude]);
  };

  const { loading, setLoading, callReception, callDelivery, callAdjust } =
    useAPI();
  const { setError } = useContext(ErrorContext);

  const deviceOrientation = useDeviceOrientation();

  useEffect(() => {
    if (coords[0] === 0 && coords[1] === 0 && permissionStatus !== "denied") {
      fetchLocation();
    }
  }, [fetchLocation, coords, permissionStatus]);

  useEffect(() => {
    setOrientation(deviceOrientation.toLowerCase());
  }, [deviceOrientation]);

  const createPayload = (settings = {}) => ({
    client_uuid: uuid,
    settings: {
      proximity,
      strength,
      orientation,
      ...settings,
      coordinates:
        settings.coordinates ||
        (manualCoords
          ? `${manualCoords[1]}, ${manualCoords[0]}`
          : Array.isArray(deviceCoords)
            ? `${deviceCoords[1]}, ${deviceCoords[0]}`
            : "0, 0"),
    },
  });

  // const detectOrientation = (imageData) => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const isLandscape = img.width > img.height;
  //       setOrientation(isLandscape ? "landscape" : "portrait");
  //       resolve(imageData);
  //     };
  //     img.src = imageData;
  //   });
  // };

  const uploadImage = async (imageData, settings = {}) => {
    try {
      console.log("📸 Starting upload with settings:", settings);
      console.log("🌍 Current coords state:", {
        manualCoords,
        deviceCoords,
        coords,
        isManuallySet: !!manualCoords,
      });

      // await detectOrientation(imageData);
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

      // Create payload with detailed logging
      const payload = {
        ...createPayload(settings),
        reference_image: resizedImage,
      };
      console.log(
        "📦 Final payload coordinates:",
        payload.settings.coordinates
      );

      const { job_id } = await callReception(payload);
      setJobId(job_id);
      checkDeliveryStatus(job_id);
    } catch (err) {
      console.error("❌ Upload error:", err);
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
    setProximity(100);
    setStrength(100);
    setManualCoords(null);
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
        coords,
        setManualCoords: handleSetManualCoords,
        isManualCoords: !!manualCoords,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
