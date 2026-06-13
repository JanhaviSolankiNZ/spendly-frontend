import { useCallback, useEffect, useState } from "react";
import { currentMonth } from "@/utils/helpers";
import type { BudgetWithUsage, IBudget } from "@/types";
import { budgetService } from "@/services/budgetService";
import { analyticsService } from "@/services/analyticsService";
import toast from "react-hot-toast";
import { PageShell } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Loader2, Plus } from "lucide-react";
import KpiCard from "../components/KpiCard";
import BudgetBar from "../components/BudgetBar";
import BudgetModal from "../components/BudgetModal";

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<BudgetWithUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BudgetWithUsage | null>(null);
  const month = currentMonth();

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const [budRes, analRes] = await Promise.all([
        budgetService.getAll(),
        analyticsService.budget(month),
      ]);
      const rawBudgets: IBudget[] = budRes.data.data.budgets;
      const utilisation: BudgetWithUsage[] = analRes.data.data.budgets ?? [];

      const merged: BudgetWithUsage[] = rawBudgets.map((b) => {
        const u = utilisation.find((u) => u.category === b.category);
        return {
          ...b,
          spent: u?.spent ?? 0,
          percent: u?.percent ?? 0,
          isOverBudget: u?.isOverBudget ?? false,
          remaining: u?.remaining ?? b.limit,
        };
      });
      setBudgets(merged);
    } catch {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSave = async (category: string, limit: number) => {
    await budgetService.upsert({ category, limit });
    toast.success(editing ? "Budget updated" : "Budget saved");
    fetchBudgets();
  };

  const handleDelete = async (budget: BudgetWithUsage) => {
    if (!confirm(`Remove budget for "${budget.category}"?`)) return;
    setDeleting(budget._id);
    try {
      await budgetService.delete(budget._id);
      toast.success("Budget removed");
      fetchBudgets();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setModal(true);
  };

  const openEdit = (b: BudgetWithUsage) => {
    setEditing(b);
    setModal(true);
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const overCount = budgets.filter((b) => b.isOverBudget).length;
  const nearCount = budgets.filter(
    (b) => !b.isOverBudget && b.percent >= 85,
  ).length;

  const overBudget = budgets.filter((b) => b.isOverBudget);
  const nearBudget = budgets.filter((b) => !b.isOverBudget && b.percent >= 85);
  const hasAlerts = overBudget.length > 0 || nearBudget.length > 0;

  return (
    <>
      <PageShell
        title="Budgets"
        subtitle={new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
        action={
          <Button
            size="sm"
            className="cursor-pointer gap-1.5"
            onClick={openAdd}
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Set budget</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
          <KpiCard
            label="Total budget"
            value={`$${totalLimit.toLocaleString()}`}
            sub={`${budgets.length} categories`}
            valueColor="#85B7EB"
          />
          <KpiCard
            label="Total spent"
            value={`$${totalSpent.toLocaleString()}`}
            sub={
              totalLimit > 0
                ? `${((totalSpent / totalLimit) * 100).toFixed(1)}% of budget`
                : "—"
            }
            valueColor="#F09595"
          />
          <KpiCard
            label="Remaining"
            value={`$${remaining.toLocaleString()}`}
            sub={
              totalLimit > 0
                ? `${((remaining / totalLimit) * 100).toFixed(1)}% left`
                : "—"
            }
            valueColor="#5DCAA5"
          />
          <KpiCard
            label="Over budget"
            value={overCount > 0 ? String(overCount) : "None"}
            sub={
              overCount > 0
                ? overBudget.map((b) => b.category.split(" / ")[0]).join(", ")
                : nearCount > 0
                  ? `${nearCount} near limit`
                  : "All within limit"
            }
            valueColor={overCount > 0 ? "#F09595" : "#5DCAA5"}
          />
        </div>

        {/* alerts */}
        {hasAlerts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
            {overBudget.map((b) => (
              <div
                key={b.category}
                className="flex gap-2.5 items-start p-3 rounded-xl border"
                style={{
                  background: "rgba(240,149,149,0.07)",
                  borderColor: "rgba(240,149,149,0.3)",
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#F09595]">
                  <AlertTriangle size={13} className="text-[#501313]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#F09595]">
                    {b.category.split(" / ")[0]} over budget
                  </p>
                  <p className="text-[10px] text-secondary mt-0.5">
                    Spent ${b.spent.toLocaleString()} of $
                    {b.limit.toLocaleString()} — $
                    {(b.spent - b.limit).toLocaleString()} over
                  </p>
                </div>
              </div>
            ))}
            {nearBudget.map((b) => (
              <div
                key={b.category}
                className="flex gap-2.5 items-start p-3 rounded-xl border"
                style={{
                  background: "rgba(239,159,39,0.07)",
                  borderColor: "rgba(239,159,39,0.3)",
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#EF9F27]">
                  <AlertCircle size={13} className="text-[#412402]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#EF9F27]">
                    {b.category.split(" / ")[0]} at {b.percent.toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-secondary mt-0.5">
                    ${b.remaining.toLocaleString()} remaining this month
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-secondary bg-card border border-border rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-card-foreground flex items-center justify-center mb-3">
              <Plus size={20} className="text-secondary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No budgets set
            </p>
            <p className="text-xs text-secondary mb-4">
              Set monthly limits to track your spending
            </p>
            <Button
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={openAdd}
            >
              <Plus size={14} /> Set your first budget
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-medium text-muted-foreground">
                Budget utilisation
              </p>
              <p className="text-xs text-secondary">Spent / Limit</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {budgets.map((b) => (
                <BudgetBar
                  key={b._id}
                  budget={b}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              ))}
            </div>
          </div>
        )}
      </PageShell>
      <BudgetModal
        open={modal}
        editing={editing}
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </>
  );
};

export default BudgetsPage;
