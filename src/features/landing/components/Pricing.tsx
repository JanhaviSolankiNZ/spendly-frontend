import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    id:       "free",
    name:     "Free",
    price:    0,
    period:   "forever",
    desc:     "Perfect for getting started",
    features: [
      "Up to 50 expenses / month",
      "AI auto-categorisation",
      "Basic analytics",
      "3 months history",
      "CSV export",
    ],
    cta:      "Get started free",
    featured: false,
  },
  {
    id:       "pro",
    name:     "Pro",
    price:    7,
    period:   "per month",
    desc:     "For serious budgeters",
    features: [
      "Unlimited expenses",
      "Full analytics + charts",
      "Unlimited history",
      "Budget alerts",
      "Priority support",
    ],
    cta:      "Start free trial",
    featured: true,
  },
];

const Pricing = () => {
  const [loading,  setLoading]  = useState<string | null>(null);
  const { user }  = useAuthStore();
  const navigate  = useNavigate();

  const handlePlanClick = async (planId: string) => {
    if (planId === "free") {
      navigate("/signup");
      return;
    }

    // pro — start Stripe checkout
    if (!user) {
      // not logged in — send to signup first, resume after
      navigate("/signup", { state: { redirectToPro: true } });
      return;
    }

    setLoading(planId);
    try {
      const { data } = await api.post("/payments/create-checkout-session", {
        planId,
      });
      // redirect to Stripe hosted checkout
      window.location.assign(data.data.url);
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

      <div className="text-center mb-10 sm:mb-12">
        <p className="text-xs text-primary font-medium tracking-widest uppercase mb-2">
          Pricing
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-muted-foreground mb-3">
          Simple, honest pricing
        </h2>
        <p className="text-sm text-secondary max-w-md mx-auto">
          Start free, upgrade when you need more
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-card rounded-xl p-6 border transition-all ${
              plan.featured
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border"
            }`}
          >
            {plan.featured && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-4">
                Most popular
              </div>
            )}

            <p className="text-sm text-secondary mb-1">{plan.name}</p>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="text-3xl font-semibold text-muted-foreground">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-xs text-secondary mb-1.5">{plan.period}</span>
              )}
            </div>
            <p className="text-xs text-secondary mb-5">{plan.desc}</p>

            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-xs text-secondary">
                  <Check size={13} className="text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full cursor-pointer ${
                plan.featured ? "" : "bg-card-foreground text-muted-foreground border border-border hover:bg-card-foreground/80"
              }`}
              variant={plan.featured ? "default" : "outline"}
              disabled={loading === plan.id}
              onClick={() => handlePlanClick(plan.id)}
            >
              {loading === plan.id
                ? <><Loader2 size={14} className="animate-spin" /> Processing...</>
                : plan.cta
              }
            </Button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-secondary mt-6">
        No credit card required for free plan · Cancel anytime
      </p>
    </section>
  );
}

export default Pricing
