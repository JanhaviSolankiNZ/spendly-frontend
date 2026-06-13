import { CAT_COLORS, type BudgetWithUsage } from "@/types";
import { Loader2, Pencil, Trash2 } from "lucide-react";

const BudgetBar = ({
  budget,
  onEdit,
  onDelete,
  deleting,
}: {
  budget: BudgetWithUsage;
  onEdit: (b: BudgetWithUsage) => void;
  onDelete: (b: BudgetWithUsage) => void;
  deleting: string | null;
}) => {
  const barColor = budget.isOverBudget
    ? "#F09595"
    : budget.percent >= 85
      ? "#EF9F27"
      : CAT_COLORS[budget.category] || "#5DCAA5";

  return (
    <div>
      {/* category + amounts + actions */}
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-sm shrink-0"
            style={{ background: CAT_COLORS[budget.category] || "#6b7280" }}
          />
          <span className="text-xs sm:text-sm text-muted-foreground truncate">
            {budget.category}
          </span>
          {budget.isOverBudget && (
            <span className="text-[10px] bg-red-500/10 text-[#F09595] border border-red-500/20 px-1.5 py-0.5 rounded-full shrink-0">
              Over
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-xs font-medium"
            style={{ color: budget.isOverBudget ? "#F09595" : "#6b7280" }}
          >
            ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
          </span>
          <button
            onClick={() => onEdit(budget)}
            className="p-1 rounded-md text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(budget)}
            disabled={deleting === budget._id}
            className="p-1 rounded-md text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            {deleting === budget._id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-2 bg-card-foreground rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(budget.percent, 100)}%`,
            background: barColor,
          }}
        />
      </div>

      {/* remaining / over + percent */}
      <div className="flex justify-between mt-1">
        <span
          className="text-[10px]"
          style={{ color: budget.isOverBudget ? "#F09595" : "#6b7280" }}
        >
          {budget.isOverBudget
            ? `$${(budget.spent - budget.limit).toLocaleString()} over budget`
            : `$${budget.remaining.toLocaleString()} remaining`}
        </span>
        <span className="text-[10px]" style={{ color: barColor }}>
          {budget.percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetBar;
