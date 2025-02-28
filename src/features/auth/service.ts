import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "./api";
import { IUserLoginRequest, IUserRegistrationRequest } from "./types";

export const useAuth = () => {
  const getMe = useQuery({
    queryKey: ["me"],
    queryFn: () => AuthAPI.me().then((res) => res.data),
  });

  const login = useMutation({
    mutationFn: (data: IUserLoginRequest) => AuthAPI.login(data).then((res) => res.data),
  });

  const register = useMutation({
    mutationFn: (data: IUserRegistrationRequest) => AuthAPI.register(data).then((res) => res.data),
  });

  return {
    user: getMe.data,
    isLoading: getMe.isLoading,
    error: getMe.error,
    login,
    register,
    getMe
  }
};
