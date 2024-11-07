import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/profile.module.css";

const QRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  // using the userId used to create the Qr code to  link the Qr Code the user and store the Qr Code in the database

  const userId = localStorage.getItem("token");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrUrl = `https://quickchart.io/qr?text=${userId}`;
        const qrResponse = await axios.get(qrUrl, { responseType: "blob" });
        const qrCodeUrl = URL.createObjectURL(qrResponse.data);
        setQrCode(qrCodeUrl);

        // Store the QR Code in the database
        const qrCodeData = {
          userId: userId,
          qrCode: qrCodeUrl,
        };
        try {
          const response = await axios.post(
            `${backendUrl}/api/user/qr-code`,
            qrCodeData
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error storing QR Code in database", error);
        }
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
      <img src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCode;
