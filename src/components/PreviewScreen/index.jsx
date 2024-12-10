// PreviewScreen/index.jsx
import React, { useContext, useState } from "react";
import { ImageContext } from "../../context/ImageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faShareAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const PreviewScreen = ({ onBack, onRegenerate }) => {
  const { image, enhancedImage } = useContext(ImageContext);
  const [isEditing, setIsEditing] = useState(false);
  const [proximity, setProximity] = useState(50);
  const [strength, setStrength] = useState(50);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = "enhanced-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Enhanced Image",
        url: enhancedImage,
      });
    } else {
      alert("Share not supported on this browser");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Implement the logic to save the edited parameters and regenerate the image
    setIsEditing(false);
    onRegenerate();
  };

  return (
    <div className="preview-screen">
      <h1>{isEditing ? "Edit Image" : "Enhanced Image"}</h1>
      {isEditing ? (
        <div className="edit-container">
          <img src={image} alt="Original" />
          <div className="slider-container">
            <label htmlFor="proximity-slider">Proximity</label>
            <input
              id="proximity-slider"
              type="range"
              min="0"
              max="100"
              value={proximity}
              onChange={(e) => setProximity(e.target.value)}
            />
            <label htmlFor="strength-slider">Strength</label>
            <input
              id="strength-slider"
              type="range"
              min="0"
              max="100"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handleSaveEdit}>
            Save
          </button>
        </div>
      ) : (
        <div className="image-container">
          <img src={enhancedImage} alt="Enhanced" className="enhanced-image" />
          <div className="overlay-buttons">
            <button className="icon-button" onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button className="icon-button" onClick={handleShare}>
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            <button className="icon-button" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        </div>
      )}
      <div className="button-container">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};
export default PreviewScreen;
