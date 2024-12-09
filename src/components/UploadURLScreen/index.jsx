// UploadURLScreen/index.jsx
import React, { useState, useContext } from "react";
import { ImageContext } from "../../context/ImageContext";
import withLoading from "../WithLoading";
import "./index.css";

const UploadURLScreen = ({ onBack }) => {
  const [url, setUrl] = useState("");
  const { setImage, uploadImage } = useContext(ImageContext);

  const handleURLUpload = () => {
    setImage(url);
    uploadImage(url);
  };

  return (
    <div className="upload-url-screen">
      <h1>Upload via URL</h1>
      <input
        type="text"
        placeholder="Enter image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleURLUpload}>Upload</button>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default withLoading(UploadURLScreen);
