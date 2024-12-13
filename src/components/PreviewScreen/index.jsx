// src/components/PreviewScreen/index.jsx
import React, { useContext, useState } from "react";
import { ImageContext } from "../../context/ImageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faShareAlt,
  faEdit,
  faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import InputSlider from "../InputSlider";
import "./index.css";
import withLoading from "../WithLoading";
import useShare from "../../hooks/useShare";

// eslint-disable-next-line no-unused-vars
const PreviewScreen = ({ onBack, onRegenerate }) => {
  const {
    image,
    enhancedImage,
    prompt,
    adjustImage,
    proximity,
    setProximity,
    strength,
    setStrength,
  } = useContext(ImageContext);
  const [isEditing, setIsEditing] = useState(false);
  const share = useShare();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = "enhanced-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    share({
      title: "Enhanced Image",
      text: "Check out this enhanced image!",
      url: enhancedImage,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    adjustImage({ proximity, strength });
    setIsEditing(false);
    onRegenerate();
  };

  return (
    <div className="preview-screen">
      {isEditing ? (
        <div className="edit-container">
          <div className="edit-header">
            <h1>Edit Settings</h1>
          </div>

          <div className="edit-content">
            <div className="controls-container">
              <div className="slider-group">
                <InputSlider
                  id="proximity"
                  label="Proximity"
                  min={1}
                  max={100}
                  value={proximity}
                  onChange={(e) => setProximity(Number(e.target.value))}
                />
                <InputSlider
                  id="strength"
                  label="Strength"
                  min={1}
                  max={100}
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="reference-image">
              <h3>Reference Image</h3>
              <div className="image-wrapper">
                <img src={image} alt="Original" className="preview-image" />
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="save-button" onClick={handleSaveEdit}>
              <FontAwesomeIcon icon={faEdit} className="button-icon" />
              Apply Changes
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="image-container">
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

          <div className="preview-content">
            {prompt && (
              <div className="prompt-display">
                <div className="prompt-header">
                  <FontAwesomeIcon
                    icon={faMagicWandSparkles}
                    className="magic-icon"
                  />
                  <span>AI Generation Prompt</span>
                </div>
                <p className="prompt-text">{prompt}</p>
              </div>
            )}

            <div className="image-group">
              <img
                src={enhancedImage}
                alt="Enhanced"
                className="enhanced-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withLoading(PreviewScreen);
