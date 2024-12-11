// src/hooks/useAPI.js
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callReception = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/reception", payload, {
        method: "POST",
      });
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data : "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const callDelivery = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/delivery", payload);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data : "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const callAdjust = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/adjust", payload);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data : "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, callReception, callDelivery, callAdjust };
};

export default useAPI;
