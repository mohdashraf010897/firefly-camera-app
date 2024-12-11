// src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://us-west1-adbe-gcp0700.cloudfunctions.net", // Base URL for the API
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 70000, // Set timeout to 70 seconds
});

export default axiosInstance;
