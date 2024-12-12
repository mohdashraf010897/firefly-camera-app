// Wrapper/index.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faHome,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { ImageContext } from "../../../context/ImageContext";
import { USE_DIRECT_CAMERA } from "../../../config";

const Wrapper = ({ children, setScreen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setImage, fetchLocation, permissionStatus } =
    useContext(ImageContext);

  const handleBack = () => {
    if (!USE_DIRECT_CAMERA) {
      setScreen("welcome");
    } else {
      setScreen("camera");
    }
    setImage(null);
  };

  return (
    <div className="wrapper">
      <header className="app-header">
        {
          <button
            onClick={handleBack}
            aria-label="Back/Home"
            className="nav-button"
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
        }
        <div className="location-status">
          {permissionStatus === "granted" ? (
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="location-icon granted"
            />
          ) : (
            <button onClick={fetchLocation} className="location-button">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="location-icon denied"
              />
              <span className="strike-through"></span>
            </button>
          )}
        </div>
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
