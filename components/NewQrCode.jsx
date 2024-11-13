import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import QRCode from "qrcode";

const QrCode = () => {
  const [src, setSrc] = useState(null);

  const generate = () => {
    QRCode.toDataURL(`https://two-school-front.onrender.com`).then(setSrc);
  };

  useEffect(() => {
    generate();
  }, []);

  if (!src) {
    return <p>Loading QR Code...</p>;
  }

  return (
    <div className={styles.qrCode}>
      <img src={src} alt="qr code" />
    </div>
  );
};

export default QrCode;
