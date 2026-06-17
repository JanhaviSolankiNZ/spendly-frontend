import { useAuthStore } from "@/store/authStore";

export const usePro = () => {
  const user = useAuthStore((s) => s.user);
  return user?.isPro ?? false;
};