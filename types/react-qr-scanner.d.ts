declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface QrScannerProps {
      onResult?: (result: { text: string }) => void;
      onError?: (error: Error) => void;
      constraints?: MediaTrackConstraints;
      style?: React.CSSProperties;
    }
  
    export default class QrScanner extends Component<QrScannerProps> {}
  }
  