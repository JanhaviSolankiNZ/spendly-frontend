import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const KPICard = ({
    label, value, sub, valueColor, trend,
}: {label: string; value: string; sub: string;
  valueColor: string; trend?: number | null;}) => {

    const TrendIcon = trend == null
    ? null
    : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend == null
    ? ""
    : trend > 0 ? "text-[#F09595]" : trend < 0 ? "text-primary" : "text-secondary";
  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
      <p className="text-xs text-secondary mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-semibold" style={{ color: valueColor }}>
        {value}
      </p>
      <div className="flex items-center gap-1 mt-1">
        {TrendIcon && (
          <TrendIcon size={11} className={trendColor} />
        )}
        <p className="text-xs text-secondary">{sub}</p>
      </div>
    </div>
  );

}

export default KPICard
