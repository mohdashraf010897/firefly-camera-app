// PreviewScreen/index.jsx
import React, { useContext, useState } from "react";
import { ImageContext } from "../../context/ImageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faShareAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import InputSlider from "../InputSlider";
import "./index.css";
import withLoading from "../WithLoading";
import useShare from "../../hooks/useShare";

const PreviewScreen = ({ onBack, onRegenerate }) => {
  const {
    image,
    enhancedImage,
    adjustImage,
    proximity,
    setProximity,
    strength,
    setStrength,
  } = useContext(ImageContext);
  console.log("🚀 ~ PreviewScreen ~ image:", image);
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
    // Call the adjustImage function to regenerate the image with new settings
    adjustImage({ proximity, strength });
    setIsEditing(false);
    onRegenerate();
  };

  return (
    <div className="preview-screen">
      <h1>{isEditing ? "Edit Image" : "Enhanced Image"}</h1>
      {isEditing ? (
        <div className="edit-container">
          <img src={image} alt="Original" />
          <div className="slider-group">
            <InputSlider
              id="proximity"
              label="Proximity"
              min={0}
              max={100}
              value={proximity}
              onChange={(e) => setProximity(Number(e.target.value))}
            />
            <InputSlider
              id="strength"
              label="Strength"
              min={0}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
            />
          </div>
          <div className="preview-edit-button-container">
            <button className="save-button" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="back-button" onClick={onBack}>
              Back
            </button>
          </div>
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
    </div>
  );
};

export default withLoading(PreviewScreen);
