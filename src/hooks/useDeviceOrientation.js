import { useState, useEffect } from "react";

const useDeviceOrientation = () => {
  const getOrientation = () =>
    window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";

  const [orientation, setOrientation] = useState(getOrientation);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return orientation;
};

export default useDeviceOrientation;
