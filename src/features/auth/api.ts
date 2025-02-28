import { api } from "../../config/api-client";
import { ITokenResponse, IUserLoginRequest, IUserRegistrationRequest, IUserResponse } from "./types";

export const AuthAPI = {
  register: (data: IUserRegistrationRequest) => api.post<IUserResponse>("/auth/register", data),
  login: (data: IUserLoginRequest) => api.post<ITokenResponse>("/auth/login", data),
  me: () => api.get<IUserResponse>("/auth/me"),
};
