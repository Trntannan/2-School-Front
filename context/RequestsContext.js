import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const RequestsContext = createContext();
const backendUrl = "https://two-school-backend.onrender.com";

export const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RequestsContext.Provider
      value={{ requests, loading, refreshRequests: fetchRequests }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
