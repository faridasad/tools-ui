import { createRoot } from "react-dom/client";
import { SERVER_BASE_URL } from "../../../config/constants";
import { IQRCode, IQRSize } from "../../../features/qr-codes/types";
import { QRCodeSVG } from "qrcode.react";
import { message } from "antd";

export const formatScanDate = (date: string | undefined): string => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString();
};

export const calculateUniqueVisitors = (ipAddresses: string[]): number => {
  return new Set(ipAddresses).size;
};

export const generateQRCodeUrl = (shortUrl: string): string => {
  return `${SERVER_BASE_URL}s/${shortUrl}`;
};

export const downloadQRCode = (selectedQR: IQRCode, size: IQRSize) => {
  if (!selectedQR) return;

  let root: ReturnType<typeof createRoot> | null = null;
  let tempContainer: HTMLDivElement | null = null;

  const cleanup = () => {
    if (root) {
      root.unmount();
      root = null;
    }
    if (tempContainer && document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
      tempContainer = null;
    }
  };

  try {
    // Create a temporary container
    tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    // Create QR code element
    const qrElement = (
      <QRCodeSVG
        value={`${SERVER_BASE_URL}s/${selectedQR.shortUrl}`}
        size={size}
        level="H"
        marginSize={2}
        style={{
          backgroundColor: "white",
        }}
        fgColor="#000000"
        bgColor="#FFFFFF"
      />
    );

    // Create and use root
    root = createRoot(tempContainer);
    root.render(qrElement);

    // Wait a bit for the render to complete
    setTimeout(() => {
      try {
        // Get the SVG element
        const svg = tempContainer?.querySelector("svg");
        if (!svg) {
          throw new Error("SVG not found");
        }

        // Create a canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        // Set canvas size
        canvas.width = size;
        canvas.height = size;

        // Draw white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);

        // Convert SVG to PNG
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          try {
            // Draw the image
            ctx.drawImage(img, 0, 0, size, size);

            // Create download link
            const link = document.createElement("a");
            link.download = `qr-code-${selectedQR.shortUrl}-${size}x${size}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();

            message.success(`QR Code (${size}x${size}) downloaded successfully`);
          } catch (error) {
            console.error("Error during image processing:", error);
            message.error("Failed to process QR Code");
          } finally {
            // Cleanup resources
            URL.revokeObjectURL(url);
            cleanup();
          }
        };

        img.onerror = () => {
          console.error("Failed to load QR code image");
          message.error("Failed to generate QR Code");
          URL.revokeObjectURL(url);
          cleanup();
        };

        img.src = url;
      } catch (error) {
        console.error("Error processing QR code:", error);
        message.error("Failed to create QR Code");
        cleanup();
      }
    }, 100);
  } catch (error) {
    console.error("Error initializing QR code:", error);
    message.error("Failed to initialize QR Code");
    cleanup();
  }
};
