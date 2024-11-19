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
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=https://two-school-front.onrender.com/${userId}`;
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
    <div className={styles.qrCodeContainer}>
      <img className={styles.qr} src={qrCode} alt="QR Code" />
    </div>
  );
};

export default QRCode;
