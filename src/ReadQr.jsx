import React from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

const ReadQr = ({ onScan }) => {
  const handleScan = (data) => {
    if (data) {
      onScan(data); // pass scanned text up to parent
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <div className="flex justify-center my-4">
       <BarcodeScanner
        delay={300}
        // onError={handleError}
        // onScan={handleScan}
        facingMode="environment"
        style={{ width: "250px", height: "250px" }}
        onUpdate={(err, result) => {
          if (result) {
            console.log("Scanned QR Code:", result);
            onScan(result.text);}
          else handleError(err);
        }}
      />
    </div>
  );
};

export default ReadQr;
