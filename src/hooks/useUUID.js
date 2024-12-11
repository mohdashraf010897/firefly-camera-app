// src/hooks/useUUID.js
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useUUID = () => {
  const [uuid, setUUID] = useState(null);

  useEffect(() => {
    const storedUUID = localStorage.getItem("client_uuid");
    if (storedUUID) {
      setUUID(storedUUID);
    } else {
      const newUUID = uuidv4();
      localStorage.setItem("client_uuid", newUUID);
      setUUID(newUUID);
    }
  }, []);

  return uuid;
};

export default useUUID;
