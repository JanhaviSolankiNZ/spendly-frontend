import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import type { Subscription } from "@/types";

export default function PaymentSuccess() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const [loading,  setLoading]  = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const sessionId = params.get("session_id");

  useEffect(() => {

    if (!sessionId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // poll subscription status — webhook may take a second to process
    const checkSubscription = async (attempts = 0) => {
      try {
        const { data } = await api.get("/payments/subscription");
        if (data.data.plan === "pro") {
          setSubscription(data.data);
          setLoading(false);
        } else if (attempts < 5) {
          // webhook hasn't processed yet — retry
          setTimeout(() => checkSubscription(attempts + 1), 1500);
        } else {
          // webhook delayed beyond reasonable wait — show success anyway
          // webhook will still process in the background
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-secondary">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  const trialEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 text-center">

        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-primary" />
        </div>

        <h1 className="text-lg font-semibold text-muted-foreground mb-1.5">
          Welcome to Pro
        </h1>
        <p className="text-sm text-secondary mb-5 leading-relaxed">
          Your 7-day free trial has started. You won't be charged until it ends.
        </p>

        <div className="bg-background rounded-xl p-3.5 text-left mb-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary">Plan</span>
            <span className="text-xs font-medium text-muted-foreground">Spendly Pro</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary">Trial ends</span>
            <span className="text-xs font-medium text-muted-foreground">{trialEnd}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary">Then billed</span>
            <span className="text-xs font-medium text-muted-foreground">$7.00/month</span>
          </div>
        </div>

        <Button
          className="w-full cursor-pointer gap-2"
          onClick={() => navigate("/dashboard", { replace: true })}
        >
          Go to dashboard <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}