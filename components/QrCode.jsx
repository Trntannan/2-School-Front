import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/profile.module.css";
import jwtDecode from "jwt-decode"; 

const QRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      const decoded = jwtDecode(token); 
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();
  
  useEffect(() => {

    if (!userId) {
      setError("User not authenticated or token is invalid.");
      return;
    }

    const generateQRCode = async () => {
      try {
        const qrUrl = `https://quickchart.io/qr?text=${userId}`;
        const qrResponse = await axios.get(qrUrl, { responseType: "blob" });
        const qrCodeUrl = URL.createObjectURL(qrResponse.data);
        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR Code", error);
        setError("Failed to generate QR Code.");
      }
    };

    generateQRCode();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!qrCode) {
    return <p>Loading QR Code...</p>;
  }

  return (
    <div className={styles.qrCodeContainer}>
      <h2>QR Code</h2>
      <img src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCode;
 

