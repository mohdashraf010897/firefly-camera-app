// src/hooks/useDeviceLocation.js
import { useState, useEffect } from "react";

const useDeviceLocation = () => {
  const [coords, setCoords] = useState([0, 0]);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const checkPermission = async () => {
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(status.state);
        status.onchange = () => setPermissionStatus(status.state);
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    }
  };
  useEffect(() => {
    checkPermission();
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
          setLocationError(null);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setCoords([0, 0]);
          setLocationError(
            "Unable to retrieve location. Falling back to default."
          );
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setCoords([0, 0]);
      setLocationError("Geolocation not supported. Falling back to default.");
    }
  };

  useEffect(() => {
    if (permissionStatus === "granted") {
      fetchLocation();
    } else if (permissionStatus === "prompt") {
      fetchLocation();
    } else if (permissionStatus === "denied") {
      setLocationError(
        "Location permission denied. Please enable location permissions in your browser settings."
      );
    }
  }, [permissionStatus]);

  return { coords, locationError, fetchLocation, permissionStatus };
};

export default useDeviceLocation;
