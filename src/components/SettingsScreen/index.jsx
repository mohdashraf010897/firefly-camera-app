// SettingsScreen.jsx
import React from 'react';

const SettingsScreen = ({ onBackClick }) => {
  return (
    <div className="settings-screen">
      <h1>Settings</h1>
      <button onClick={onBackClick}>Back to Camera</button>
    </div>
  );
};

export default SettingsScreen;