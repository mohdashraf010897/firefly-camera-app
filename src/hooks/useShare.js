// src/hooks/useShare.js
import { useCallback } from "react";

const useShare = () => {
  const share = useCallback(async ({ title, text, url }) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      alert("Share not supported on this browser");
    }
  }, []);

  return share;
};

export default useShare;
