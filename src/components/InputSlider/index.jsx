// InputSlider/index.jsx
import React, { useState } from "react";
import "./index.css";

const InputSlider = ({ id, label, min, max, value, onChange }) => {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    let newValue = Number(e.target.value);
    if (newValue < min) {
      newValue = min;
      setError(`Value cannot be less than ${min}`);
    } else if (newValue > max) {
      newValue = max;
      setError(`Value cannot be greater than ${max}`);
    } else {
      setError("");
    }
    onChange({ target: { value: newValue } });
  };

  return (
    <div className="input-slider-container">
      <label htmlFor={id} className="input-slider-label">
        {label}
      </label>
      <div className="input-slider-wrapper">
        <span className="input-slider-min">{min}</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="input-slider-input"
        />
        <span className="input-slider-max">{max}</span>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className={`input-slider-number-input ${error ? "input-error" : ""}`}
        />
      </div>
      {error && <div className="input-slider-error">{error}</div>}
    </div>
  );
};

export default InputSlider;
