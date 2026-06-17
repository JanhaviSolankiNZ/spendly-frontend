import { useState, useEffect } from "react";
import ChartCard from "../components/ChartCard";
import KPICard from "../components/KPICard";
import { analyticsService } from "@/services/analyticsService";
import {
  CAT_COLORS,
  type AnalyticsSummary,
  type BudgetSummary,
  type IncomeSummary,
  type SixMonthTrend,
} from "@/types";
import { incomeService } from "@/services/incomeService";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { PageShell } from "@/layouts/MainLayout";
import {
  ResponsiveContainer,
  Pie,
  Tooltip,
  PieChart,
  Cell,
  Cell as BarCell,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  type TooltipProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { currentMonth, shiftMonth, formatMonthLabel } from "@/utils/helpers";
import BudgetBar from "../components/BudgetBar";
import Loader from "@/components/Loader";
import { usePro } from "@/hooks/usePro";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  label?: string | number;
};

const ChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-secondary mb-1">{label}</p>}
      <p className="text-muted-foreground font-medium">
        ${payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
};

const AnalyticsPage = () => {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trend, setTrend] = useState<SixMonthTrend | null>(null);
  const [income, setIncome] = useState<IncomeSummary | null>(null);
  const [budget, setBudget] = useState<BudgetSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const isPro = usePro();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [s, t, b, inc] = await Promise.all([
          analyticsService.summary(month),
          analyticsService.trend(month),
          analyticsService.budget(month),
          incomeService.summary(month),
        ]);
        setSummary(s.data.data);
        setTrend(t.data.data);
        setBudget(b.data.data.budgets);
        setIncome(inc.data.data);
      } catch {
        console.log("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [month]);

  const pieData =
    summary?.byCategory?.map((c) => ({
      name: c.category,
      value: c.total,
    })) ?? [];

  const compData = summary
    ? [
        { name: "Income", amount: income?.total ?? 0, color: "#5DCAA5" },
        { name: "Expenses", amount: summary.totalExpenses, color: "#F09595" },
        { name: "Savings", amount: summary.netSavings ?? 0, color: "#85B7EB" },
      ]
    : [];

  const trendData =
    trend?.trend?.map((t) => ({
      name: new Date(t.year, t.month - 1).toLocaleString("default", {
        month: "short",
      }),
      total: t.total,
      current: t.current,
    })) ?? [];

  return (
    <PageShell
      title="Analytics"
      action={
        <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setMonth(shiftMonth(month, -1))}
            className="px-2 py-1.5 text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs sm:text-sm text-muted-foreground px-2 min-w-[110px] sm:min-w-[130px] text-center select-none">
            {formatMonthLabel(month)}
          </span>
          <button
            onClick={() => setMonth(shiftMonth(month, 1))}
            className="px-2 py-1.5 text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      }
    >
      {loading && <Loader overlay={true} />}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <KPICard
          label="Total income"
          value={`$${(income?.total ?? 0).toLocaleString()}`}
          sub={
            summary?.vsLastMonth != null
              ? `${summary.vsLastMonth > 0 ? "+" : ""}${summary.vsLastMonth}% vs last month`
              : "—"
          }
          valueColor="#5DCAA5"
          trend={summary?.vsLastMonth}
        />
        <KPICard
          label="Total expenses"
          value={`$${(summary?.totalExpenses ?? 0).toLocaleString()}`}
          sub={`${summary?.expensesPercentage ?? 0}% of income`}
          valueColor="#F09595"
          trend={null}
        />
        <KPICard
          label="Net savings"
          value={`$${(summary?.netSavings ?? 0).toLocaleString()}`}
          sub={`${summary?.savingsPercentage ?? 0}% saved`}
          valueColor="#85B7EB"
          trend={null}
        />
        <KPICard
          label="Top category"
          value={summary?.topCategory?.name?.split(" / ")[0] ?? "—"}
          sub={`$${summary?.topCategory?.total ?? 0} · ${summary?.topCategory?.percent ?? 0}%`}
          valueColor="#e5e7eb"
          trend={null}
        />
      </div>
      {isPro ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
        <ChartCard title="Expenses by category">
          {pieData.length === 0 ? (
            <p className="text-sm text-secondary text-center py-8">
              No expenses this month
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={48}
                    paddingAngle={2}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CAT_COLORS[entry.name] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* legend */}
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[160px]">
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ background: CAT_COLORS[d.name] || "#6b7280" }}
                      />
                      <span className="text-xs text-secondary truncate">
                        {d.name.split(" / ")[0]}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      ${d.value?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Income vs expenses vs savings">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={compData} barSize={44} margin={{ top: 8 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e2535"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {compData.map((d, i: number) => (
                  <BarCell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="6-month spending trend" className="md:col-span-full">
          <div className="flex justify-between items-center mb-3 -mt-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <div className="w-3 h-1 rounded bg-primary" />
                Current month
              </div>
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <div className="w-3 h-1 rounded bg-card-foreground border border-border" />
                Previous months
              </div>
            </div>
            {trend?.average != null && (
              <span className="text-xs text-secondary">
                6-mo avg: ${trend.average?.toLocaleString()}
              </span>
            )}
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={trendData} barSize={32} margin={{ top: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e2535"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {trendData.map((d, i: number) => (
                  <BarCell key={i} fill={d.current ? "#5DCAA5" : "#1e2535"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Budget utilisation" className="mb-4 md:col-span-full">
          {(budget ?? []).length === 0 ? (
            <p className="text-sm text-secondary text-center py-6">
              No budgets set — go to the Budgets page to set monthly limits.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {(budget ?? []).map((b: BudgetSummary) => (
                <BudgetBar
                  key={b.category}
                  category={b.category}
                  spent={b.spent}
                  limit={b.limit}
                  percent={b.percent}
                  isOverBudget={b.isOverBudget}
                />
              ))}
            </div>
          )}
        </ChartCard>
      </div>: (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Lock size={24} className="text-secondary mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Unlock full analytics
          </p>
          <p className="text-xs text-secondary mb-4">
            6-month trends and budget tracking are Pro features
          </p>
          <Button className="cursor-pointer" onClick={() => navigate("/settings")}>
            Upgrade to Pro
          </Button>
        </div>
      )}
    </PageShell>
  );
};

export default AnalyticsPage;
