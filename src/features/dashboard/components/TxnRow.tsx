import type { LucideIcon } from 'lucide-react';

const TxnRow = ({
  icon, iconBg, iconColor, name, sub,
  amount, amountColor, badge,
}: {
  icon: LucideIcon; iconBg: string; iconColor: string;
  name: string; sub: string;
  amount: string; amountColor: string;
  badge?: string;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-muted-foreground truncate">{name}</p>
          {badge && (
            <span className="text-[9px] bg-card-foreground text-[#AFA9EC] px-1.5 py-0.5 rounded shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[10px] text-secondary mt-0.5">{sub}</p>
      </div>
      <p className="text-xs font-semibold shrink-0" style={{ color: amountColor }}>
        {amount}
      </p>
    </div>
  );
}

export default TxnRow
