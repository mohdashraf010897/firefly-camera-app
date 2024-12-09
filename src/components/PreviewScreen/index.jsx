// PreviewScreen/index.jsx
import React, { useContext } from "react";
import { ImageContext } from "../../context/ImageContext";
import "./index.css";

const PreviewScreen = ({ onBack, onRegenerate }) => {
  const { enhancedImage } = useContext(ImageContext);

  return (
    <div className="preview-screen">
      <h1>Enhanced Image</h1>
      {enhancedImage && <img src={enhancedImage} alt="Enhanced" />}
      <div className="button-container">
        <button className="save-button">Save to Gallery</button>
        <button className="download-button">Download</button>
        <button className="regenerate-button" onClick={onRegenerate}>
          Regenerate
        </button>
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PreviewScreen;
