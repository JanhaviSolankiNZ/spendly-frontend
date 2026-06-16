import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 text-center">

        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <X size={28} className="text-[#F09595]" />
        </div>

        <h1 className="text-lg font-semibold text-muted-foreground mb-1.5">
          Payment cancelled
        </h1>
        <p className="text-sm text-secondary mb-5 leading-relaxed">
          No charge was made. You can try again anytime — your account stays
          on the Free plan.
        </p>

        <Button
          className="w-full cursor-pointer mb-2"
          onClick={() => navigate("/#pricing")}
        >
          Try again
        </Button>
        <Button
          variant="outline"
          className="w-full border-border text-secondary cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Continue with Free plan
        </Button>
      </div>
    </div>
  );
}