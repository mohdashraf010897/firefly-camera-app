// Loading/index.jsx
import React from "react";
import PropTypes from "prop-types";
import "./index.css";

const Loading = ({ message }) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: "Loading, please wait...",
};

export default Loading;
