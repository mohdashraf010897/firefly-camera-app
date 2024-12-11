// Wrapper.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faHome } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { ImageContext } from "../../../context/ImageContext";

const Wrapper = ({ children, setScreen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setImage } = useContext(ImageContext);
  const handleBack = () => {
    setScreen("welcome");
    setImage(null);
  };

  return (
    <div className="wrapper">
      <header className="app-header">
        <button
          onClick={handleBack}
          aria-label="Back/Home"
          className="nav-button"
        >
          <FontAwesomeIcon icon={faHome} />
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
