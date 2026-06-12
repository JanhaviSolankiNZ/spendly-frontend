import { ArrowRight, type LucideIcon } from 'lucide-react';
import React from 'react'

const QuickAction = ({
  Icon, iconBg, iconColor, label, sub, onClick,
}: {
  Icon: LucideIcon; iconBg: string; iconColor: string;
  label: string; sub: string; onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border rounded-xl hover:bg-card-foreground transition-colors cursor-pointer text-left w-full"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-[10px] text-secondary mt-0.5">{sub}</p>
      </div>
      <ArrowRight size={14} className="text-secondary shrink-0" />
    </button>
  );
}

export default QuickAction
