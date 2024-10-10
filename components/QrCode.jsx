import React, { useState, useEffect } from "react";
import axios from "axios";

const QRCodeComponent = ({ userId }) => {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrUrl = `https://quickchart.io/qr?text=${userId}`;
        const qrResponse = await axios.get(qrUrl, { responseType: "blob" });
        const qrCodeUrl = URL.createObjectURL(qrResponse.data);
        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR Code", error);
      }
    };

    if (userId) {
      generateQRCode();
    }
  }, [userId]);

  if (!qrCode) {
    return <p>Loading QR Code...</p>;
  }

  return (
    <div>
      <h2>QR Code</h2>
      <img src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCodeComponent;

 // Example usage: <QRCodeComponent userId={localStorage.getItem("userId")} /> 

