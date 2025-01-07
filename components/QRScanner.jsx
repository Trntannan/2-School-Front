import { QrScanner } from "react-qr-scanner";
import styles from "../styles/QRScanner.module.css";

const QRScanner = ({ onScan, onClose }) => {
  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <QrScanner
          constraints={{ facingMode: "environment" }}
          onResult={(result) => {
            if (result) {
              onScan(result.text);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default QRScanner;
