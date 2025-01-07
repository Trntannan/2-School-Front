"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import styles from "../styles/QRScanner.module.css";

const QRScanner = ({ onScan, onClose }) => {
  const [pause, setPause] = useState(false);

  const handleScan = (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);
    setPause(true);
    onScan(detectedCodes[0].rawValue);
    setPause(false);
  };

  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <Scanner
          formats={["qr_code"]}
          onScan={handleScan}
          onError={(error) => console.log(error?.message)}
          styles={{ container: { height: "90%", width: "90%" } }}
          components={{
            audio: true,
            onOff: true,
            torch: true,
            finder: true,
          }}
          scanDelay={2000}
          paused={pause}
        />
      </div>
    </div>
  );
};

export default QRScanner;
