import { TrendingUp, TrendingDown } from "lucide-react";

const KpiCard = ({
  label, value, sub, valueColor, change,
}: {
  label: string; value: string; sub: string;
  valueColor: string; change?: number | null;
}) => {
  const Icon = change == null ? null
    : change > 0 ? TrendingUp
    : change < 0 ? TrendingDown
    : null;

  const changeColor = change == null ? "text-secondary"
    : change > 0 ? "text-[#F09595]"
    : "text-primary";

  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
      <p className="text-xs text-secondary mb-1.5">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold" style={{ color: valueColor }}>
        {value}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        {Icon && <Icon size={11} className={changeColor} />}
        <p className="text-xs text-secondary">{sub}</p>
      </div>
    </div>
  );
}

export default KpiCard
