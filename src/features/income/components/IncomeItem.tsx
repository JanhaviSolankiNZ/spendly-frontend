import { Briefcase, Code, TrendingUp, Home, Building2, HelpCircle, Trash2, type LucideIcon } from "lucide-react";
import { type Income } from "@/types";
import { format } from "date-fns"

const TYPE_ICONS: Record<string, LucideIcon> = {
  Salary:     Briefcase,
  Freelance:  Code,
  Investment: TrendingUp,
  Rental:     Home,
  Business:   Building2,
  Other:      HelpCircle,
};

const TYPE_COLORS: Record<string, string> = {
  Salary:     "#5DCAA5",
  Freelance:  "#EF9F27",
  Investment: "#85B7EB",
  Rental:     "#AFA9EC",
  Business:   "#F0997B",
  Other:      "#6b7280",
};

const IncomeItem = ({
  income, onDelete,
}: {
  income: Income; onDelete: (id: string) => void;
})  => {
  const Icon  = TYPE_ICONS[income.incomeType]  || HelpCircle;
  const color = TYPE_COLORS[income.incomeType] || "#6b7280";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "22" }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground truncate">
          {income.source}
        </p>
        <p className="text-[11px] text-secondary mt-0.5">
          {income.incomeType} · {format(new Date(income.date), "MMM d")}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <p className="text-sm font-semibold text-primary">
          +${income.amount.toLocaleString()}
        </p>
        <button
          onClick={() => onDelete(income._id)}
          className="p-1.5 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default IncomeItem