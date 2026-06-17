import { useState, useEffect } from "react";
import { Check, Loader2, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

interface Subscription {
  plan: "free" | "pro";
  subscriptionStatus?: "active" | "trialing" | "canceled" | "past_due";
  currentPeriodEnd?: string;
  isActive: boolean;
}

const PRO_FEATURES = [
  "Unlimited expenses",
  "Full analytics + charts",
  "Budget alerts",
  "Priority support",
];

const STATUS_LABELS: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  active: { label: "Active", bg: "rgba(93,202,165,0.12)", color: "#5DCAA5" },
  trialing: { label: "Trial", bg: "rgba(93,202,165,0.12)", color: "#5DCAA5" },
  past_due: {
    label: "Past due",
    bg: "rgba(239,159,39,0.12)",
    color: "#EF9F27",
  },
  canceled: {
    label: "Canceled",
    bg: "rgba(240,149,149,0.12)",
    color: "#F09595",
  },
};

export default function SubscriptionSettings() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data } = await api.get("/payments/subscription");
        setSub(data.data);
      } catch {
        toast.error("Failed to load subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data } = await api.post("/payments/create-portal-session");
      window.location.href = data.data.url;
    } catch {
      toast.error("Could not open billing portal");
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const { data } = await api.post("/payments/create-checkout-session");
      window.location.href = data.data.url;
    } catch {
      toast.error("Could not start checkout");
      setUpgradeLoading(false);
    }
  };

  const isPro = sub?.plan === "pro";
  const status = sub?.subscriptionStatus
    ? STATUS_LABELS[sub.subscriptionStatus]
    : null;

  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-sm">
      {loading && <Loader overlay={true}  />}
      <h3 className="text-sm font-medium text-muted-foreground mb-3.5">
        Subscription
      </h3>

      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        {/* plan header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-medium text-muted-foreground">
                {isPro ? "Spendly Pro" : "Spendly Free"}
              </span>
              {status && (
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              )}
            </div>
            <p className="text-xs text-secondary">
              {isPro
                ? sub?.subscriptionStatus === "canceled"
                  ? "Your subscription has been cancelled"
                  : "Renews automatically each month"
                : "Limited to 50 expenses / month"}
            </p>
          </div>
          {isPro && (
            <span className="text-lg font-semibold text-muted-foreground">
              $7<span className="text-xs text-secondary font-normal">/mo</span>
            </span>
          )}
        </div>

        {/* trial / renewal info */}
        {isPro && periodEnd && (
          <div className="bg-background rounded-lg p-3 mb-4">
            <p className="text-xs text-secondary">
              {sub?.subscriptionStatus === "trialing"
                ? `First charge on ${periodEnd}`
                : `Next billing date: ${periodEnd}`}
            </p>
          </div>
        )}

        {/* feature list */}
        {isPro && (
          <div className="space-y-1.5 mb-4">
            {PRO_FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-xs text-secondary"
              >
                <Check size={13} className="text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        )}

        {/* actions */}
        {isPro ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full border-border text-secondary cursor-pointer gap-2"
              onClick={handleManage}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CreditCard size={14} />
              )}
              Manage payment method
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-[#F09595] hover:bg-red-500/10 cursor-pointer gap-2"
              onClick={handleManage}
              disabled={portalLoading}
            >
              <XCircle size={14} />
              Cancel subscription
            </Button>
          </div>
        ) : (
          <Button
            className="w-full cursor-pointer"
            onClick={handleUpgrade}
            disabled={upgradeLoading}
          >
            {upgradeLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Redirecting...
              </>
            ) : (
              "Upgrade to Pro & get 7-day free trial"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
