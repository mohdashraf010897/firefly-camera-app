// src/hooks/useDeviceLocation.js
import { useState, useEffect, useCallback } from "react";

const useDeviceLocation = () => {
  const [coords, setCoords] = useState([0, 0]);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");

  const fetchLocation = useCallback(() => {
    console.log("🌍 Fetching location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("✅ Location fetched:", { latitude, longitude });
          setCoords([latitude, longitude]);
          setLocationError(null);
          setPermissionStatus("granted");
        },
        (error) => {
          console.error("❌ Location error:", error);
          setCoords([0, 0]);
          setPermissionStatus("denied");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied. Please enable GPS.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("Unable to retrieve location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("❌ Geolocation not supported");
      setPermissionStatus("denied");
      setLocationError("Geolocation not supported by this browser.");
    }
  }, []);

  const checkPermission = useCallback(async () => {
    console.log("🔍 Checking geolocation permission...");
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log("📍 Permission status:", status.state);
        setPermissionStatus(status.state);
        if (status.state === "granted") {
          fetchLocation();
        }
        status.onchange = () => {
          console.log("📍 Permission status changed to:", status.state);
          setPermissionStatus(status.state);
          if (status.state === "granted") {
            fetchLocation();
          }
        };
      } catch (error) {
        console.error("❌ Error checking permission:", error);
        fetchLocation();
      }
    } else {
      console.log(
        "⚠️ Permissions API not supported, trying direct location fetch"
      );
      fetchLocation();
    }
  }, [fetchLocation]);

  useEffect(() => {
    console.log("🔄 useDeviceLocation hook mounted");
    checkPermission();
  }, [checkPermission]);

  return { coords, locationError, fetchLocation, permissionStatus };
};

export default useDeviceLocation;
