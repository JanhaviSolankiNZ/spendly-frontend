import { create } from "zustand";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import type { IUser, IAuthState } from "@/types/auth";
import axios from "axios";

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  isAuthLoading: false,
  isHydrating: false,
  authStatus: "loading",
  login: async (email: string, password: string) => {
    set({ isAuthLoading: true });
    try {
      const { data } = await authService.login({ email, password });
      const user = data.data.user;
      set({ user, isAuthLoading: false, authStatus: "authenticated"  });
      toast.success("Welcome back!");
      return true;
    } catch (error: unknown) {
      let message = "Invalid email or password";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
      set({ isAuthLoading: false, authStatus: "unauthenticated"  });
      return false;
    }
  },
  register: async (email: string, password: string, username: string) => {
    set({ isAuthLoading: true });
    try {
      await authService.register({
        email,
        password,
        username,
      });
      set({ isAuthLoading: false });
      toast.success("Account created! Please sign in.");
      return true;
    } catch (error: unknown) {
      let message = "Registration failed!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
      set({ isAuthLoading: false, authStatus: "unauthenticated" });
      return false;
    }
  },
  logout: async () => {
    set({ isAuthLoading: true });
    try {
      await authService.logout();
    } catch (error: unknown) {
      let message = "Error!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      set({ user: null, isAuthLoading: false });
      toast.success("Logged out");
    }
  },
  setUser: (user: IUser | null) => {
    set({ user });
  },
  hydrate: async () => {
    set({isHydrating: true})
    try {
      const { data } = await authService.me();
      set({ user: data.data.user, isHydrating: false, authStatus: "authenticated" });
    } catch {
      set({ user: null, isHydrating: false, authStatus: "unauthenticated" });
    }
},
}));
