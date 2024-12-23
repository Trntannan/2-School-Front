import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/profile.module.css";

const QRCode = ({ userTier }) => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const generateQRCode = async () => {
      const token = localStorage.getItem("token");
      try {
        const qrData = {
          token,
          tier: userTier,
          timestamp: Date.now(),
        };

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          JSON.stringify(qrData)
        )}`;
        const qrResponse = await axios.get(qrUrl, { responseType: "blob" });
        const qrCodeUrl = URL.createObjectURL(qrResponse.data);

        setQrCode(qrCodeUrl);

        await axios.post(
          `${backendUrl}/api/users/update-qr`,
          { qrData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error generating QR Code", error);
        setError("Failed to generate QR Code.");
      }
    };

    if (!qrCode) {
      generateQRCode();
    }

    // Refresh QR code every 5 minutes for security
    const refreshInterval = setInterval(generateQRCode, 300000);
    return () => clearInterval(refreshInterval);
  }, [userTier]);

  const renderTierBadge = () => {
    const tierColors = {
      BRONZE: "#CD7F32",
      SILVER: "#C0C0C0",
      GOLD: "#FFD700",
      PLATINUM: "#E5E4E2",
    };

    return (
      <div
        style={{
          backgroundColor: tierColors[userTier],
          padding: "5px 10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        {userTier} Tier
      </div>
    );
  };

  if (error) return <p>{error}</p>;

  if (!qrCode) {
    return (
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
        disabled
      >
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        Processing...
      </button>
    );
  }

  return (
    <div className={styles.qrContainer}>
      {renderTierBadge()}
      <img className={styles.qr} src={qrCode} alt="QR Code" />
      {verificationStatus && (
        <div className={styles.verificationStatus}>{verificationStatus}</div>
      )}
    </div>
  );
};

export default QRCode;
