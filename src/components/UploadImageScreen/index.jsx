// UploadImageScreen/index.jsx
import React, { useContext } from "react";
import { ImageContext } from "../../context/ImageContext";
import withLoading from "../WithLoading";
import "./index.css";

const UploadImageScreen = ({ onBack }) => {
  const { setImage, uploadImage } = useContext(ImageContext);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImage(base64Image);
        uploadImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-image-screen">
      <h1>Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default withLoading(UploadImageScreen);
