// src/hooks/useAPI.js
import { useState, useContext } from "react";
import axiosInstance from "../api/axiosConfig";
import { ErrorContext } from "../context/ErrorContext";

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const { error, setError } = useContext(ErrorContext);

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
        if (response.data.error) {
          throw new Error(response.data.error_message);
        }
        setLoading(false);
        return response.data;
      } else if (response.status === 202) {
        return { jobNotFinished: true };
      } else {
        setLoading(false);
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
      throw err;
    }
  };

  const callAdjust = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/adjust", payload);
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
              "Bad request, no client_uuid or job_id set, or no settings defined"
            );
            break;
          case 404:
            setError("Job not found");
            break;
          case 403:
            setError("Job found but client_uuid mismatch");
            break;
          case 409:
            setError(
              "Job found and matches with client_uuid, initial job still pending"
            );
            break;
          case 510:
            setError(
              "Job done but no upload_id found, resubmit the job and upload the image again, use the reception endpoint"
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

  return { loading, error, callReception, callDelivery, callAdjust };
};

export default useAPI;
