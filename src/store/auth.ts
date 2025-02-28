// src/stores/auth-store.ts
import { create } from "zustand";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";
import { SERVER_BASE_URL } from "../config/constants";

// Types
export interface IUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface ISession {
  token: string;
}

interface IAuthStore {
  user: IUser | null;
  session: ISession | null;
  isAuthPending: boolean;
  
  // Core auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: "/",
  secure: process.env.NODE_ENV === "production", // Use secure in production
  sameSite: "strict"
} as Cookies.CookieAttributes;

// Cookie names
const COOKIE_NAMES = {
  USER: "asan_tools_user",
  TOKEN: "asan_tools_token"
};

// Create auth store
export const useAuthStore = create<IAuthStore>((set, get) => ({
  // Initial state - try to get data from cookies
  user: Cookies.get(COOKIE_NAMES.USER) 
    ? JSON.parse(Cookies.get(COOKIE_NAMES.USER) || "") 
    : null,
  session: Cookies.get(COOKIE_NAMES.TOKEN) 
    ? { token: Cookies.get(COOKIE_NAMES.TOKEN) || "" } 
    : null,
  isAuthPending: false,
  
  // Login method
  login: async (email: string, password: string) => {
    try {
      set({ isAuthPending: true });
      
      const response = await axios.post(
        `${SERVER_BASE_URL}auth/login`, 
        { email, password }
      );
      
      const { user, accessToken } = response.data;
      
      // Save to cookies
      Cookies.set(COOKIE_NAMES.USER, JSON.stringify(user), COOKIE_OPTIONS);
      Cookies.set(COOKIE_NAMES.TOKEN, accessToken, COOKIE_OPTIONS);
      
      // Update state
      set({ 
        user, 
        session: { token: accessToken }, 
        isAuthPending: false 
      });
      
      message.success("Login successful");
      
      // Navigate to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      set({ isAuthPending: false });
      message.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  },
  
  // Register method
  register: async (email: string, password: string, fullName: string) => {
    try {
      set({ isAuthPending: true });
      
      const response = await axios.post(
        `${SERVER_BASE_URL}auth/register`, 
        { email, password, fullName }
      );
      
      const { user, accessToken } = response.data;
      
      // Save to cookies
      Cookies.set(COOKIE_NAMES.USER, JSON.stringify(user), COOKIE_OPTIONS);
      Cookies.set(COOKIE_NAMES.TOKEN, accessToken, COOKIE_OPTIONS);
      
      // Update state
      set({ 
        user, 
        session: { token: accessToken }, 
        isAuthPending: false 
      });
      
      message.success("Registration successful");
      
      // Navigate to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      set({ isAuthPending: false });
      message.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  },
  
  // Logout method
  logout: () => {
    // Clear cookies
    Cookies.remove(COOKIE_NAMES.USER, { path: "/" });
    Cookies.remove(COOKIE_NAMES.TOKEN, { path: "/" });
    
    // Clear state
    set({ user: null, session: null });
    
    // Redirect to login
    window.location.href = "/login";
  }
}));