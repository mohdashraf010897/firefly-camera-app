// src/hooks/useDeviceLocation.js
import { useState, useEffect, useCallback } from "react";

const useDeviceLocation = () => {
  const [coords, setCoords] = useState([0, 0]);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const [isManuallySet, setIsManuallySet] = useState(false);

  const fetchLocation = useCallback(() => {
    if (isManuallySet || permissionStatus === "denied") return;

    console.log("🌍 Fetching location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("✅ Location fetched:", { latitude, longitude });
          setCoords([longitude, latitude]);
          setLocationError(null);
          setPermissionStatus("granted");
        },
        (error) => {
          console.error("❌ Location error:", error);
          setCoords([0, 0]);
          setPermissionStatus("denied");
          setLocationError(
            "Location access denied. Please enter coordinates manually."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [isManuallySet, permissionStatus]);

  const checkPermission = useCallback(async () => {
    if (isManuallySet) return;

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
  }, [fetchLocation, isManuallySet]);

  const setManualCoords = useCallback((coordString) => {
    console.log("🚀 ~ setManualCoords ~ coordString:", coordString);
    const [longitude, latitude] = coordString
      .split(",")
      .map((c) => parseFloat(c.trim()));
    setCoords([longitude, latitude]);
    setIsManuallySet(true);
    setLocationError(null);
    setPermissionStatus("manual");
  }, []);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ !isManuallySet:", !isManuallySet);
    if (!isManuallySet) {
      checkPermission();
    }
  }, [checkPermission, isManuallySet]);

  console.log("🚀 ~ useDeviceLocation ~ coords:", coords);
  console.log("🚀 ~ useDeviceLocation ~ isManuallySet:", isManuallySet);
  return {
    coords,
    locationError,
    fetchLocation,
    permissionStatus,
    setManualCoords,
    isManuallySet,
  };
};

export default useDeviceLocation;
