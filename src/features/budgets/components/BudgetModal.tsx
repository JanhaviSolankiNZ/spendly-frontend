import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EXPENSE_CATEGORIES, type BudgetWithUsage } from '@/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const BudgetModal = ({
  open, editing, onClose, onSave,
}: {
  open:    boolean;
  editing: BudgetWithUsage | null;
  onClose: () => void;
  onSave:  (category: string, limit: number) => Promise<void>;
}) => {

    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0] as string);
  const [limit,    setLimit]    = useState("");
  const [saving,   setSaving]   = useState(false);

   // populate when editing
  useEffect(() => {
    if (editing) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(editing.category);
      setLimit(String(editing.limit));
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
      setLimit("");
    }
  }, [editing, open]);

  const handleSave = async () => {
    if (!limit || Number(limit) <= 0) {
      toast.error("Enter a valid limit");
      return;
    }
    setSaving(true);
    try {
      await onSave(category, Number(limit));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-base font-medium text-muted-foreground mb-1">
          {editing ? "Edit budget" : "Set budget limit"}
        </h2>
        <p className="text-xs text-secondary mb-5">
          Define a monthly spending limit for a category
        </p>

        <div className="space-y-4">
          {/* category — disabled when editing since category is the key */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!editing}
              className="w-full h-11 bg-background border border-border text-muted-foreground px-3 rounded-lg text-sm outline-none focus:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* limit */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Monthly limit ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 500"
              value={limit}
              inputMode="decimal"
              className="h-11"
              onChange={(e) => setLimit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          {/* info */}
          <div className="bg-card-foreground border border-border rounded-lg px-3 py-2.5 text-xs text-secondary leading-relaxed">
            You'll get an alert at 85% and again when you exceed the limit.
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 bg-card-foreground text-secondary border border-border py-2.5 rounded-lg text-sm cursor-pointer hover:text-muted-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
              : editing ? "Update budget" : "Save budget"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetModal
