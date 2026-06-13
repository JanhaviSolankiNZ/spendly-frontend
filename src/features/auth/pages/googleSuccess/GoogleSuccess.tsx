import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// this page lives at /auth/google/success
// Google redirects here with ?token=...&user=...
export default function GoogleSuccess() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    const user  = params.get("user");

    if (!token || !user) {
      toast.error("Google sign in failed");
      navigate("/signin", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(user));
      setUser(parsedUser);

      // clean the URL — remove token from query params immediately
      window.history.replaceState({}, "", "/dashboard");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Google sign in failed");
      navigate("/signin", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={26} className="animate-spin text-primary" />
    </div>
  );
}