import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/profile.module.css";

const QRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("token");

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
      <img src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCode;
