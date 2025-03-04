import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URLShortenerAPI } from "./api";
import { ICreateURL } from "./types";

export const useUrlService = () => {
  const queryClient = useQueryClient();

  const urlQuery = useQuery({
    queryKey: ["urls"],
    queryFn: () => URLShortenerAPI.getAll().then((res) => res.data),
  });

  const createUrl = useMutation({
    mutationFn: (data: ICreateURL) => URLShortenerAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  const updateUrl = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateURL> }) => URLShortenerAPI.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  const deleteUrl = useMutation({
    mutationFn: (id: string) => URLShortenerAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  return { urls: urlQuery.data, isLoading: urlQuery.isLoading, error: urlQuery.error, createUrl, updateUrl, deleteUrl };
};

export const useUrlById = (id: string) => {
  const urlQuery = useQuery({
    queryKey: ["url", id],
    queryFn: () => URLShortenerAPI.get(id).then((res) => res.data),
    enabled: !!id,
  });

  const getAnalytics = useQuery({
    queryKey: ["url-analytics", id],
    queryFn: () => URLShortenerAPI.getAnalytics(id).then((res) => res.data),
    enabled: !!id,
  });

  return { url: urlQuery.data, isLoading: urlQuery.isLoading, error: urlQuery.error, getAnalytics };
};
