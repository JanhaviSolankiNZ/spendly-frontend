import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Download,
  Loader2,
  Pencil,
  Plus,
  Receipt,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import {
  CAT_COLORS,
  CAT_SHORT,
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseSummary,
} from "@/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { expenseService } from "@/services/expenseService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const KpiCard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) => {
  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
      <p className="text-xs text-secondary mb-1 font-medium">{label}</p>
      <p className="text-lg sm:text-xl font-semibold" style={{ color: color }}>
        {value}
      </p>
      <p
        className="text-xs mt-1 text-secondary font-medium"
        style={{ color: color }}
      >
        {sub}
      </p>
    </div>
  );
};

const FilterRow = ({
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

const currentMonth = () => new Date().toISOString().slice(0, 7);

const ExpensePage = () => {
  const [searchQ, setSearchQ] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search:"",
    month: "2024-12",
    category: "",
    page:1
  });

  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const debounceSearch = (search: string) => {
    setSearchQ(search);
    if(debounceRef.current){
        clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
        updateSearch(search)
    }, 1000)
  }

  const updateSearch = (search: string) => {
    setFilters((prev) => ({
    ...prev,
    search,
    page: 1,
  }));
};

const updateMonth = (month: string) => {
  setFilters((prev) => ({
    ...prev,
    month,
    page: 1,
  }));
};

const updateCategory = (category: string) => {
  setFilters((prev) => ({
    ...prev,
    category,
    page: 1,
  }));
};

const updatePage = (page: number) => {
  setFilters((prev) => ({
    ...prev,
    page,
  }));
};

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const [expRes, sumRes] = await Promise.all([
        expenseService.getAll({
          month: filters.month,
          search: filters.search || undefined,
          category: filters.category || undefined,
          page: filters.page,
          limit: 10,
        }),

        expenseService.summary(filters.month),
      ]);
        console.log("#summary",sumRes)
      setExpenses(expRes.data.data.expenses);
      setPagination(expRes.data.data.pagination);
      setSummary(sumRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [filters]);


const { month, category, page} = filters;

const handleDelete = async (id: string) => {
  if(!confirm("Delete this expense")) return;
  setDeleting(id);
  try{
    await expenseService.delete(id);
    toast.success("Expense deleted");
  }catch{
    toast.error("Failed to delete");
  }finally{
    setDeleting(null);
  }
};

const handleExport = async () => {
  //
};

const vsText = summary !== null ? `${summary?.vsLastMonth > 0 ? "+": ""}${summary?.vsLastMonth}% vs last month`: "_";

  return (
    <PageShell
      title="Expenses"
      action={
        <div className="flex gap-2">
          <Button className="hidden sm:flex border-border text-foreground bg-card-foreground cursor-pointer gap-1.5" onClick={handleExport}>
            <Download size={14} />
            <span className="hidden md:inline">Export CSV</span>
          </Button>
          <Button className="cursor-pointer gap-1.5 " onClick={() => navigate("/expenses/add")}>
            <Plus size={14} />
            <span className="hidden sm:inline">Add</span>
            <span className="hidden sm:inline">Expense</span>
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <KpiCard
          label="This month"
          value={`$${(summary?.totalExpenses ?? 0).toLocaleString()}`}
          sub={vsText}
          color="#F09595"
        />
        <KpiCard
          label="Transactions"
          value={String(summary?.transactions ?? 0)}
          sub={month}
          color="#85B7EB"
        />
        <KpiCard
          label="Largest spend"
          value={summary?.largestSpend?.description ?? "-"}
          sub={`$${summary?.largestSpend?.amount ?? 0}`}
          color="#e5e7eb"
        />
        <KpiCard
          label="Daily average"
           value={`$${summary?.dailyAverage ?? 0}`}
          sub={`${summary?.daysInMonth ?? 30} days`}
          color="#EF9F27"
        />
      </div>
      <div className="mb-3 sm:mb-4">
        <div className="hidden sm:flex gap-3 flex-wrap items-center">
          <FilterRow
            search={searchQ}
            setSearch={debounceSearch}
            month={month}
            setMonth={updateMonth}
            category={category}
            setCategory={updateCategory}
          />
        </div>

        {/* mobile search + filter */}
        <div className="flex sm:hidden gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            />
            <Input
              placeholder="Search..."
              value={searchQ}
              onChange={(e) => debounceSearch(e.target.value)}
              className="pl-8 h-10 text-sm"
            />
          </div>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 h-10 rounded-lg border text-sm font-medium transition-colors cursor-pointer",
              filterOpen || category || month !== currentMonth()
                ? "bg-primary-muted text-primary border-primary"
                : "bg-card border-border text-secondary",
            )}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <SlidersHorizontal size={14} />
            Filter
            {(category || month !== currentMonth()) && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />
            )}
          </button>
        </div>
        {/* mobile filter panel */}
        <div className="sm:hidden mt-2 p-3 bg-card border border-border rounded-xl space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Filters
            </span>
            <Button
              onClick={() => setFilterOpen(false)}
              className="text-secondary py-2 px-2 rounded-lg cursor-pointer"
            >
              <X size={14} />
            </Button>
          </div>
          <div>
            <label className="text-xs text-secondary mb-1.5 block">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => updateMonth(e.target.value)}
              className="w-full bg-background border border-border text-muted-foreground text-sm px-3 py-2 rounded-lg outline-none focus:border-primary "
            />
          </div>
          <div>
            <label className="text-xs text-secondary mb-1.5 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["", ...EXPENSE_CATEGORIES].map((cat) => (
                <button
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                    category === cat
                      ? "bg-primary-muted text-primary border-primary"
                      : "bg-background text-secondary border-border",
                  )}
                >
                  {cat === "" ? "All" : CAT_SHORT[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-secondary ">
          <Receipt size={32} className="mb-3 opacity-30" />
          <p className="text-sm">No expenses found for this period</p>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden sm:block  bg-card rounded-xl border border-border overflow-hidden mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Description", "Category", "Date", "Amount", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-xs text-secondary font-medium text-left px-4 py-3 border-b border-border"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp: Expense) => (
                  <ExpenseTableRow
                    key={exp._id}
                    deleting={null}
                    onEdit={() => navigate(`/expense/${exp._id}/edit`)}
                    onDelete={() => handleDelete(exp._id)}
                    exp={exp}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {/* mobile card list */}
          <div className="sm:hidden space-y-2 mb-4">
            {expenses.map((exp) => (
              <ExpenseCard
                key={exp._id}
                exp={exp}
                deleting={deleting}
                onEdit={() => navigate(`/expense/${exp._id}/edit`)}
                onDelete={() => handleDelete(exp._id)}
              />
            ))}
          </div>

          {/* pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col xs:flex-flow justify-between items-center gap-3 mt-2">
              <p className="text-xs text-secondary order-2 xs:order-1">
                Showing {expenses.length} of {pagination.total}
              </p>
              <div className="flex gap-1.5 order-1 xs:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-secondary cursor-pointer"
                  disabled={page <= 1}
                  onClick={() => updatePage(page - 1)}
                >
                  Prev
                </Button>
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <Button
                    className={cn(
                      "cursor-pointer",
                      p !== page &&
                        "border-border text-secondary cursor-pointer",
                    )}
                    onClick={() => updatePage(p)}
                    key={p}
                    size="sm"
                    variant={p === page ? "default" : "outline"}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-secondary cursor-pointer"
                  disabled={page >= pagination.totalPages}
                  onClick={() => updatePage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageShell>
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

const CatBadge = ({ category }: { category: string }) => {
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

export default ExpensePage;
