import { create } from "zustand";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import type { IUser, IAuthState } from "@/types/auth";
import axios from "axios";

const getStoredUser = (): IUser | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<IAuthState>((set) => ({
  user: getStoredUser(),
  loading: false,
  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data } = await authService.login({ email, password });
      const accessToken = data.data.accessToken;
      const user = data.data.user;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, loading: false });
      toast.success("Welcome back!");
      return true;
    } catch (error: unknown) {
      let message = "Invalid email or password";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
      set({ loading: false });
      return false;
    }
  },
  register: async (email: string, password: string, username: string) => {
    set({ loading: true });
    try {
      const { data } = await authService.register({
        email,
        password,
        username,
      });
      const accessToken = data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      set({ loading: false });
      toast.success("Account created! Please sign in.");
      return true;
    } catch (error: unknown) {
      let message = "Registration failed!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
      set({ loading: false });
      return false;
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch (error: unknown) {
      let message = "Error!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      set({ user: null, loading: false });
      toast.success("Logged out");
    }
  },
  setUser: (user: IUser | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
}));
