// UploadImageScreen/index.jsx
import React, { useContext, useState, useEffect } from "react";
import { ImageContext } from "../../context/ImageContext";
import withLoading from "../WithLoading";
import "./index.css";

const UploadImageScreen = ({ onBack }) => {
  const { setImage, uploadImage, coords, setManualCoords } =
    useContext(ImageContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [manualCoordsInput, setManualCoordsInput] = useState(
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

  const handleCoordsChange = (e) => {
    const value = e.target.value;
    setManualCoordsInput(value);
    console.log(
      "🚀 ~ handleCoordsChange ~ isValidCoords(value):",
      isValidCoords(value)
    );
    if (isValidCoords(value)) {
      setManualCoords(value);
    }
  };

  const handleSubmit = () => {
    console.log("🔘 Submit clicked with:", {
      manualCoordsInput,
      isValid: isValidCoords(manualCoordsInput),
    });

    if (!selectedFile || !isValidCoords(manualCoordsInput)) return;

    console.log("✅ Uploading with coordinates:", manualCoordsInput);
    uploadImage(selectedFile, { coordinates: manualCoordsInput });
  };

  // Update coords when device location changes
  useEffect(() => {
    if (coords && coords[0] !== 0 && coords[1] !== 0) {
      setManualCoordsInput(`${coords[1]}, ${coords[0]}`);
    }
  }, [coords]);

  const getInputClassName = () => {
    if (!manualCoordsInput) return "coordinates-input";
    return `coordinates-input ${
      isValidCoords(manualCoordsInput) ? "valid" : "invalid"
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
            value={manualCoordsInput}
            onChange={handleCoordsChange}
            className={getInputClassName()}
          />
          {manualCoordsInput && !isValidCoords(manualCoordsInput) && (
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
            disabled={!selectedFile || !isValidCoords(manualCoordsInput)}
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
