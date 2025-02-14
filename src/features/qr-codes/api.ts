import { api } from "../../config/api-client";
import { IQRCode, IQRScan, ICreateQRCode } from "./types";

export const QRCodesAPI = {
  create: (data: ICreateQRCode) => api.post<IQRCode>("/qr-codes", data),

  getAll: () => api.get<IQRCode[]>("/qr-codes"),

  getById: (id: string) => api.get<IQRCode>(`/qr-codes/${id}`),

  update: (id: string, data: Partial<ICreateQRCode>) => api.patch<IQRCode>(`/qr-codes/${id}`, data),

  delete: (id: string) => api.delete(`/qr-codes/${id}`),

  getScans: (shortUrl: string) => api.get<IQRScan[]>(`/qr-codes/s/${shortUrl}/scans`),
};
