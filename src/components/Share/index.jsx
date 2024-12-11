import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faGoogle } from "@fortawesome/free-brands-svg-icons"; // Import Gmail and WhatsApp icons

const ImageShare = ({ imageUrl }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this image!",
          text: "I found this amazing image, take a look:",
          url: imageUrl, // Share the image URL
        });
        alert("Image shared successfully!");
      } catch (error) {
        console.error("Error sharing image:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this image: ${imageUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };
  const handleGmailShare = () => {
    const subject = "Check out this amazing image!";
    const body = `I found this image and thought you might like it: ${imageUrl}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  
    window.open(gmailUrl, "_blank");
  };
  
  
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <img
        src={imageUrl}
        alt="Shareable"
        style={{
          maxWidth: "100%",
          maxHeight: "400px",
          display: "block",
          margin: "0 auto 20px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {/* Web Share API Button */}
        <button
          onClick={handleShare}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FontAwesomeIcon icon={faShareAlt} />
          Share
        </button>

        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          style={{
            backgroundColor: "#25D366", // WhatsApp green color
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          WhatsApp
        </button>

        {/* Gmail Share Button */}
        <button
          onClick={handleGmailShare}
          style={{
            backgroundColor: "#DB4437", // Gmail red color
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FontAwesomeIcon icon={faGoogle} />
          Gmail
        </button>
      </div>
    </div>
  );
};

export default ImageShare;
