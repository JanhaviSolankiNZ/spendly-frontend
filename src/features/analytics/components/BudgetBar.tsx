import { CAT_COLORS } from "@/types";

const BudgetBar = ({
  category,
  spent,
  limit,
  percent,
  isOverBudget,
}: {
  category: string;
  spent: number;
  limit: number;
  percent: number;
  isOverBudget: boolean;
}) => {
  const barColor = isOverBudget
    ? "#F09595"
    : percent >= 85
      ? "#EF9F27"
      : CAT_COLORS[category] || "#5DCAA5";

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-secondary truncate mr-2">{category}</span>
        <span
          className="shrink-0 font-medium"
          style={{ color: isOverBudget ? "#F09595" : "#6b7280" }}
        >
          ${spent.toLocaleString()} / ${limit.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 bg-card-foreground rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: barColor,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span
          className="text-[10px]"
          style={{ color: isOverBudget ? "#F09595" : "#6b7280" }}
        >
          {isOverBudget
            ? `$${(spent - limit).toLocaleString()} over budget`
            : `$${(limit - spent).toLocaleString()} remaining`}
        </span>
        <span className="text-[10px]" style={{ color: barColor }}>
          {percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetBar;
