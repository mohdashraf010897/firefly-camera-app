// Wrapper.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const Wrapper = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="wrapper">
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
      {children}
    </div>
  );
};

export default Wrapper;
