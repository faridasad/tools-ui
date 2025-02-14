import { SERVER_BASE_URL } from "../../config/constants";

export const formatScanDate = (date: string | undefined): string => {
  if (!date) return "Never";
  const utcDate = new Date(date);
  return utcDate.toLocaleString('az-AZ', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};
export const calculateUniqueVisitors = (ipAddresses: string[]): number => {
  return new Set(ipAddresses).size;
};

export const generateQRCodeUrl = (shortUrl: string): string => {
  return `${SERVER_BASE_URL}s/${shortUrl}`;
};