"use client";

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import styles from "../styles/QRScanner.module.css";

const QRScanner = ({ onScan, onClose }) => {
  const [deviceId, setDeviceId] = useState(undefined);
  const [tracker, setTracker] = useState("centerText");
  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = (detectedCodes) => {
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
        <div className={styles.controls}>
          <select onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>Select a device</option>
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
          <select onChange={(e) => setTracker(e.target.value)}>
            <option value="centerText">Center Text</option>
            <option value="outline">Outline</option>
            <option value="boundingBox">Bounding Box</option>
            <option value={undefined}>No Tracker</option>
          </select>
        </div>
        <Scanner
          formats={["qr_code", "micro_qr_code", "aztec", "data_matrix"]}
          constraints={{
            deviceId: deviceId,
          }}
          onScan={handleScan}
          onError={(error) => console.log(error?.message)}
          styles={{ container: { height: "400px", width: "350px" } }}
          components={{
            audio: true,
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
            tracker: getTracker(),
          }}
          scanDelay={2000}
          paused={pause}
        />
      </div>
    </div>
  );
};

export default QRScanner;
