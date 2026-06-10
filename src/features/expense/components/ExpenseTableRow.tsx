import { type Expense } from "@/types";
import { CatBadge } from "./ExpenseCard";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {format} from "date-fns"

const ExpenseTableRow = ({
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
  return (
    <tr className="border-b border-card-foreground hover:bg-card-foreground/50 transition-colors">
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground font-medium">
          {exp.description}
        </span>
      </td>
      <td className="px-4 py-3">
        <CatBadge category={exp.category} />
      </td>
      <td className="px-4 py-3 text-sm text-secondary">
        {format(new Date(exp.date), "MMM d")}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-[#F09595]">
        {exp.amount.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button
            className="p-1.5 rounded-md text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
            title="Edit"
            onClick={onEdit}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            disabled={deleting === exp._id}
            className="p-1.5 rounded-md text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete"
          >
            {deleting === exp._id ? (
              <Loader2 size={14} />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseTableRow
