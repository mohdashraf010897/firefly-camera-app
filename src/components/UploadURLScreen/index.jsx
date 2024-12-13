// UploadURLScreen/index.jsx
import React, { useState, useContext } from "react";
import { ImageContext } from "../../context/ImageContext";
import useDeviceLocation from "../../hooks/useDeviceLocation";
import withLoading from "../WithLoading";
import "./index.css";

const UploadURLScreen = ({ onBack }) => {
  const [url, setUrl] = useState("");
  const [manualCoords, setManualCoords] = useState("");
  const { setImage, uploadImage } = useContext(ImageContext);
  const { coords, locationError } = useDeviceLocation();

  const handleURLUpload = () => {
    // Validate coordinates if manually entered
    if (manualCoords) {
      const coordsRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      if (!coordsRegex.test(manualCoords)) {
        alert("Please enter coordinates in the format 'longitude, latitude'");
        return;
      }
      const [longitude, latitude] = manualCoords
        .split(",")
        .map((coord) => coord.trim());
      setImage(url);
      uploadImage(url, [parseFloat(latitude), parseFloat(longitude)]);
    } else {
      // Use device location from the hook
      setImage(url);
      uploadImage(url, coords);
    }
  };

  return (
    <div className="upload-url-screen">
      <h1>Upload via URL</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
        />
        <input
          type="text"
          placeholder={`Enter coordinates (long, lat) or use device location: ${coords.join(
            ", "
          )}`}
          value={manualCoords}
          onChange={(e) => setManualCoords(e.target.value)}
          className="coordinates-input"
        />
        {locationError && <div className="location-error">{locationError}</div>}
      </div>
      <div className="button-group">
        <button onClick={handleURLUpload} disabled={!url}>
          Upload
        </button>
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default withLoading(UploadURLScreen);
