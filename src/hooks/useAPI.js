// src/hooks/useAPI.js
import { useState, useContext } from "react";
import axiosInstance from "../api/axiosConfig";
import { ErrorContext } from "../context/ErrorContext";

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const { setError } = useContext(ErrorContext);

  const callReception = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/reception2", payload);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 405:
            setError("Wrong method, use POST");
            break;
          case 400:
            setError(
              "Bad request, no client_uuid, settings or reference_image set"
            );
            break;
          case 500:
            setError("Unexpected error");
            break;
          default:
            setError(`Unexpected response code: ${err.response.status}`);
        }
      } else {
        setError("Network error");
      }
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
      if (response.status === 200) {
        setLoading(false);
        return response.data;
      } else if (response.status === 202) {
        setLoading(false);
        return { jobNotFinished: true };
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 405:
            setError("Wrong method, use POST");
            break;
          case 400:
            setError("Bad request, no client_uuid or job_id set");
            break;
          case 404:
            setError("Job not found");
            break;
          case 403:
            setError("Job found but client_uuid mismatch");
            break;
          case 500:
            setError("Unexpected error");
            break;
          default:
            setError(`Unexpected response code: ${err.response.status}`);
        }
      } else {
        setError("Network error");
      }
      setLoading(false);
      throw err;
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

  return { loading, callReception, callDelivery, callAdjust };
};

export default useAPI;
