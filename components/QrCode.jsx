import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/profile.module.css";

require("dotenv").config();
const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const QRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateQRCode = async () => {
      const userId = localStorage.getItem("token");
      try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=https://two-school-front.onrender.com`;
        const qrResponse = await axios.get(qrUrl, { responseType: "blob" });
        const qrCodeUrl = URL.createObjectURL(qrResponse.data);
        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR Code", error);
        setError("Failed to generate QR Code.");
      }
    };

    if (!qrCode) {
      generateQRCode();
    }
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!qrCode) {
    return <p>Loading QR Code...</p>;
  }

  return (
    <div className={styles.qrCodeContainer}>
      <img className={styles.qr} src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCode;
