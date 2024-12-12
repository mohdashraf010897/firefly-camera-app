// src/hooks/useUUID.js
import { useEffect, useState } from "react";

const useUUID = () => {
  const [uuid, setUUID] = useState(null);

  useEffect(() => {
    const storedUUID = localStorage.getItem("client_uuid");
    if (storedUUID) {
      setUUID(
        "shortcut-portrait-no-job"
        //  storedUUID
      );
    } else {
      const newUUID = "shortcut-portrait-no-job";
      //uuidv4();
      localStorage.setItem("client_uuid", newUUID);
      setUUID(newUUID);
    }
  }, []);

  return uuid;
};

export default useUUID;
