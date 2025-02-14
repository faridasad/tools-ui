import { QR_EXPORT_SIZES } from "../../config/constants";

export interface IQRScan {
  id: string;
  shortUrl: string;
  qrCodeId: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
  scannedAt: string;
}

export interface IQRCode {
  id: string;
  name: string;
  originalUrl: string;
  shortUrl: string;
  scans: IQRScan[];
  qrImage?: string;
  scanCount?: number;
  lastScan?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ICreateQRCode {
  name: string;
  originalUrl: string;
}

export type IQRSize = (typeof QR_EXPORT_SIZES)[number]["value"];
