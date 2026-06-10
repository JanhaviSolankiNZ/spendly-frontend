import { type Expense } from "@/types";
import { CAT_COLORS, CAT_SHORT } from "@/types";
import { Pencil, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

export const CatBadge = ({ category }: { category: string }) => {
  const color = CAT_COLORS[category] || "#6b7280";
  return (
    <span
      className="inline-flex text-[10px] sm:text-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap"
      style={{ background: color + "22", color }}
    >
      {CAT_SHORT[category] ?? category}
    </span>
  );
};

const ExpenseCard = ({
  exp,
  deleting,
  onEdit,
  onDelete,
}: {
  exp: Expense;
  deleting: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const color = CAT_COLORS[exp.category] || "#6b7280";
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl items-center justify-center shrink-0 mt-0.5"
          style={{ background: color + "22" }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {exp.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <CatBadge category={exp.category} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#F09595]">
                -${exp.amount.toFixed(2)}
              </p>
              <p className="text-[11px] text-secondary mt-0.5">
                {format(new Date(exp.date), "MMM d")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer border border-border"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={onDelete}
          disabled={deleting === exp._id}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border border-border"
        >
          {deleting === exp._id ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <>
              <Trash2 size={13} />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard
