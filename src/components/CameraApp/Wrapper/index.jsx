// Wrapper.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faHome,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { ImageContext } from "../../../context/ImageContext";

const Wrapper = ({ children, screen, setScreen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { enhancedImage } = useContext(ImageContext);

  const handleBack = () => {
    if (screen === "preview" && enhancedImage) {
      setScreen("uploadImage");
    } else {
      setScreen("welcome");
    }
  };

  return (
    <div className="wrapper">
      <header className="app-header">
        <button
          onClick={handleBack}
          aria-label="Back/Home"
          className="nav-button"
        >
          {screen === "welcome" ? (
            <FontAwesomeIcon icon={faHome} />
          ) : (
            <FontAwesomeIcon icon={faArrowLeft} />
          )}
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="theme-toggle-button"
        >
          {theme === "dark" ? (
            <FontAwesomeIcon icon={faSun} className="sun-icon" />
          ) : (
            <FontAwesomeIcon icon={faMoon} className="moon-icon" />
          )}
        </button>
      </header>
      <div className="wrapper-content">{children}</div>
    </div>
  );
};

export default Wrapper;
