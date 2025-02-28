// src/features/auth/components/auth-guard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AuthAPI } from "../features/auth/api";
import { useAuthStore } from "../store/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  
  // Check if we have a token in cookies
  const token = Cookies.get("asan_token");
  
  // If no token, redirect immediately
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verify the token by fetching the current user
  const { isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => AuthAPI.me().then((res) => res.data),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Verifying authentication..." />
      </div>
    );
  }

  if (isError) {
    // Token is invalid or expired
    // No need to manually remove token as logout() already does this
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};