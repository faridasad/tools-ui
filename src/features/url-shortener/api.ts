import { api } from "../../config/api-client";
import { ICreateURL, IURL, IURLAnalytics } from "./types";

export const URLShortenerAPI = {
    create: (data: ICreateURL) => api.post<IURL>("/urls", data),
    get: (id: string) => api.get<IURL>(`/urls/${id}`),
    getAll: () => api.get<IURL[]>("/urls"),
    update: (id: string, data: Partial<ICreateURL>) => api.patch<IURL>(`/urls/${id}`, data),
    delete: (id: string) => api.delete(`/urls/${id}`),
    getAnalytics: (id: string) => api.get<IURLAnalytics>(`/urls/${id}/analytics`),
}