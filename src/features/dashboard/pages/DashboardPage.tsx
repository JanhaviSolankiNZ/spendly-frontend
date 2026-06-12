import { currentMonth, shiftMonth, formatMonthLabel } from "@/utils/helpers";
import { INCOME_COLORS, INCOME_ICONS } from "@/utils/constants";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChartPie,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  // , Wallet
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { PageShell } from "@/layouts/MainLayout";
import KpiCard from "../components/KpiCard";
import SectionHeader from "../components/SectionHeader";
import { CAT_COLORS, CAT_SHORT, type IDashboard } from "@/types";
import TxnRow from "../components/TxnRow";
import { Button } from "@/components/ui/button";
import QuickAction from "../components/QuickAction";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// function AlertCard({
//   type, title, sub,
// }: {
//   type: "danger" | "warn"; title: string; sub: string;
// }) {
//   const isDanger = type === "danger";
//   return (
//     <div
//       className="flex gap-2.5 items-start p-3 rounded-xl border"
//       style={{
//         background: isDanger ? "rgba(240,149,149,0.07)" : "rgba(239,159,39,0.07)",
//         borderColor: isDanger ? "rgba(240,149,149,0.3)" : "rgba(239,159,39,0.3)",
//       }}
//     >
//       <div
//         className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
//         style={{
//           background: isDanger ? "#F09595" : "#EF9F27",
//           color:      isDanger ? "#501313"  : "#412402",
//         }}
//       >
//         {isDanger
//           ? <AlertTriangle size={13} />
//           : <AlertCircle  size={13} />
//         }
//       </div>
//       <div>
//         <p
//           className="text-xs font-medium"
//           style={{ color: isDanger ? "#F09595" : "#EF9F27" }}
//         >
//           {title}
//         </p>
//         <p className="text-[10px] text-secondary mt-0.5">{sub}</p>
//       </div>
//     </div>
//   );
// }

const DashboardPage = () => {
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState<IDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard", { params: { month } });
        setData(res.data.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [month]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );

  const s = data?.summary;
  //const budgets  = data?.budgets ?? [];
  // const overBudget  = budgets.filter((b: any) => b.isOverBudget);
  // const nearBudget  = budgets.filter((b: any) => !b.isOverBudget && b.percent >= 85);
  //const hasAlerts   = overBudget.length > 0 || nearBudget.length > 0;
  const hasAlerts = false;

  return (
    <PageShell>
      {/* ── greeting + month nav ── */}
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-muted-foreground">
            {greeting()}, {user?.username?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Your financial overview for {formatMonthLabel(month)}
          </p>
        </div>
        <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setMonth(shiftMonth(month, -1))}
            className="px-2 py-1.5 text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs text-muted-foreground px-2 min-w-[90px] sm:min-w-[110px] text-center select-none">
            {formatMonthLabel(month)}
          </span>
          <button
            onClick={() => setMonth(shiftMonth(month, 1))}
            className="px-2 py-1.5 text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── KPI cards — 2 col mobile, 4 col desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <KpiCard
          label="Total income"
          value={`$${(s?.totalIncome ?? 0).toLocaleString()}`}
          sub={
            s?.incomeChange != null
              ? `${s.incomeChange > 0 ? "+" : ""}${s.incomeChange}% vs last month`
              : "No data last month"
          }
          valueColor="#5DCAA5"
          change={s?.incomeChange}
        />
        <KpiCard
          label="Total expenses"
          value={`$${(s?.totalExpenses ?? 0).toLocaleString()}`}
          sub={
            s?.expenseChange != null
              ? `${s.expenseChange > 0 ? "+" : ""}${s.expenseChange}% vs last month`
              : "No data last month"
          }
          valueColor="#F09595"
          change={s?.expenseChange}
        />
        <KpiCard
          label="Net savings"
          value={`$${(s?.netSavings ?? 0).toLocaleString()}`}
          sub={`${s?.savingsPercent ?? 0}% of income saved`}
          valueColor="#85B7EB"
        />
        <KpiCard
          label="Transactions"
          value={String(s?.transactions ?? 0)}
          sub={`Avg $${s?.dailyAverage ?? 0} / day`}
          valueColor="#EF9F27"
        />
      </div>

      {/* ── budget alerts — only shown when over or near limit ── */}
      {hasAlerts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {/* {overBudget.map((b: any) => (
            <AlertCard
              key={b.category}
              type="danger"
              title={`${b.category.split(" / ")[0]} over budget`}
              sub={`Spent $${b.spent.toLocaleString()} of $${b.limit.toLocaleString()} — $${(b.spent - b.limit).toLocaleString()} over`}
            />
          ))}
          {nearBudget.map((b: any) => (
            <AlertCard
              key={b.category}
              type="warn"
              title={`${b.category.split(" / ")[0]} at ${b.percent.toFixed(0)}%`}
              sub={`$${b.remaining.toLocaleString()} remaining this month`}
            />
          ))} */}
        </div>
      )}

      {/* ── recent expenses + recent income ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* recent expenses */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <SectionHeader
            title="Recent expenses"
            linkLabel="View all"
            onLink={() => navigate("/expenses")}
          />
          {(data?.recentExpenses ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-secondary">
              <p className="text-xs">No expenses this month</p>
            </div>
          ) : (
            (data?.recentExpenses ?? []).map((exp) => {
              const color = CAT_COLORS[exp.category] || "#6b7280";
              return (
                <TxnRow
                  key={exp._id}
                  icon={Briefcase}
                  iconBg={color + "22"}
                  iconColor={color}
                  name={exp.description}
                  sub={`${CAT_SHORT[exp.category] ?? exp.category} · ${format(new Date(exp.date), "MMM d")}`}
                  amount={`-$${exp.amount.toLocaleString()}`}
                  amountColor="#F09595"
                />
              );
            })
          )}
          <div className="px-4 py-2.5 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border text-secondary cursor-pointer"
              onClick={() => navigate("/expenses/add")}
            >
              + Add expense
            </Button>
          </div>
        </div>

        {/* recent income */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <SectionHeader
            title="Recent income"
            linkLabel="View all"
            onLink={() => navigate("/income")}
          />
          {(data?.recentIncome ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-secondary">
              <p className="text-xs">No income this month</p>
            </div>
          ) : (
            (data?.recentIncome ?? []).map((inc) => {
              const Icon = INCOME_ICONS[inc.incomeType] || HelpCircle;
              const color = INCOME_COLORS[inc.incomeType] || "#6b7280";
              return (
                <TxnRow
                  key={inc._id}
                  icon={Icon}
                  iconBg={color + "22"}
                  iconColor={color}
                  name={inc.source}
                  sub={`${inc.incomeType} · ${format(new Date(inc.date), "MMM d")}`}
                  amount={`+$${inc.amount.toLocaleString()}`}
                  amountColor="#5DCAA5"
                />
              );
            })
          )}
          <div className="px-4 py-2.5 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border text-secondary cursor-pointer"
              onClick={() => navigate("/income/add")}
            >
              + Add income
            </Button>
          </div>
        </div>
      </div>

      {/* ── quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickAction
          Icon={ChartPie}
          iconBg="rgba(93,202,165,0.15)"
          iconColor="#5DCAA5"
          label="View analytics"
          sub="Charts, trends, category breakdowns"
          onClick={() => navigate("/analytics")}
        />
        {/* <QuickAction
          Icon={Wallet}
          iconBg="rgba(239,159,39,0.15)"
          iconColor="#EF9F27"
          label="Manage budgets"
          sub="Set & track monthly category limits"
          onClick={() => navigate("/budgets")}
        /> */}
      </div>
    </PageShell>
  );
};

export default DashboardPage;
