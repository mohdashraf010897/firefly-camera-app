// UploadImageScreen/index.jsx
import React, { useContext, useState, useEffect } from "react";
import { ImageContext } from "../../context/ImageContext";
import useDeviceLocation from "../../hooks/useDeviceLocation";
import withLoading from "../WithLoading";
import "./index.css";

const UploadImageScreen = ({ onBack }) => {
  const { setImage, uploadImage } = useContext(ImageContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const { coords } = useDeviceLocation();
  const [manualCoords, setManualCoords] = useState(
    coords ? `${coords[1]}, ${coords[0]}` : ""
  );

  const isValidCoords = (coords) => {
    const coordsRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    return coordsRegex.test(coords);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    if (!isValidCoords(manualCoords)) {
      alert("Please enter coordinates in the format 'longitude, latitude'");
      return;
    }
    console.log("🚀 ~ handleSubmit ~ manualCoords:", manualCoords);

    uploadImage(selectedFile, { coordinates: manualCoords });
  };

  // Update coords when device location changes
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ coords:", coords);
    if (coords) {
      setManualCoords(`${coords[1]}, ${coords[0]}`);
    }
  }, [coords]);

  const getInputClassName = () => {
    if (!manualCoords) return "coordinates-input";
    return `coordinates-input ${
      isValidCoords(manualCoords) ? "valid" : "invalid"
    }`;
  };

  return (
    <div className="upload-image-screen">
      <h1>Upload Image</h1>
      <div className="upload-content">
        <div className="file-input-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          <span className="file-input-label">
            {selectedFile ? "Image selected" : "Click to select an image"}
          </span>
        </div>

        {selectedFile && (
          <div className="preview-container">
            <img src={selectedFile} alt="Preview" className="image-preview" />
          </div>
        )}

        <div className="coordinates-input-container">
          <input
            type="text"
            placeholder="Enter coordinates (format: longitude, latitude)"
            value={manualCoords}
            onChange={(e) => setManualCoords(e.target.value)}
            className={getInputClassName()}
          />
          {manualCoords && !isValidCoords(manualCoords) && (
            <div className="coordinates-error">
              Please enter coordinates in the format &quot;longitude,
              latitude&quot;
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedFile || !isValidCoords(manualCoords)}
          >
            Upload Image
          </button>
          <button className="back-button" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default withLoading(UploadImageScreen);
