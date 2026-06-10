import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EXPENSE_CATEGORIES, CAT_SHORT } from "@/types";
import { cn } from "@/lib/utils";

const FilterRow =  ({
  search,
  setSearch,
  month,
  setMonth,
  category,
  setCategory,
}: {
  search: string;
  setSearch: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
}) => {
  return (
    <>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
        />
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 w-44 h-9"
        />
      </div>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="bg-card border border-border text-muted-foreground text-sm px-3 py-1.5 rounded-lg outline-none focus:border-primary cursor-pointer h-9"
      />
      <div className="flex gap-1.5 flex-wrap">
        {["", ...EXPENSE_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "text-xs px-2.5 py-1.5 rounded-full border transition-all cursor-pointer",
              category === cat
                ? "bg-primary-muted text-primary border-primary"
                : "bg-card text-secondary border-border hover:text-muted-foreground",
            )}
          >
            {cat === "" ? "All" : CAT_SHORT[cat]}
          </button>
        ))}
      </div>
    </>
  );
};

export default FilterRow
