import { ClientOnly } from "remix-utils/client-only";
import { QrScanner as QrScannerComponent } from "@yudiel/react-qr-scanner";
import React from "react";

interface QrScannerProps {
  onChange: (data: string) => void;
  onError: (err: Error) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onChange, onError }) => {
  return (
    <ClientOnly fallback={null}>
      {() => (
        <QrScannerComponent
          containerStyle={{
            height: 320,
            width: 320,
          }}
          onError={onError}
          onDecode={onChange}
        />
      )}
    </ClientOnly>
  );
};
