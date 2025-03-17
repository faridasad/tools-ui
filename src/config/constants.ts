
export const SERVER_BASE_URL = "https://tools.vescode.net/api/v1/";
// export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const QR_EXPORT_SIZES = [
  { label: "256 x 256", value: 256 },
  { label: "512 x 512", value: 512 },
  { label: "1024 x 1024", value: 1024 },
] as const;
