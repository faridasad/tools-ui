import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QRCodesAPI } from "./api";
import { ICreateQRCode } from "./types";
import { AxiosError } from "axios";

export const useQRCodes = () => {
  const queryClient = useQueryClient();

  const qrCodesQuery = useQuery({
    queryKey: ["qr-codes"],
    queryFn: () => QRCodesAPI.getAll().then((res) => res.data),
    staleTime: 0,
    gcTime: 0,
  });

  const createQRCode = useMutation({
    mutationFn: (data: ICreateQRCode) => QRCodesAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    },
  });

  const updateQRCode = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateQRCode> }) => QRCodesAPI.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    }
  });

  const deleteQRCode = useMutation({
    mutationFn: (id: string) => QRCodesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
    },
  });

  return {
    qrCodes: qrCodesQuery.data ?? [],
    isLoading: qrCodesQuery.isLoading,
    error: qrCodesQuery.error,
    createQRCode,
    updateQRCode,
    deleteQRCode,
  };
};

export const useQRCodeScans = (shortUrl: string) => {
  return useQuery({
    queryKey: ["qr-code-scans", shortUrl],
    queryFn: () => QRCodesAPI.getScans(shortUrl).then((res) => res.data),
    enabled: !!shortUrl,
  });
};
