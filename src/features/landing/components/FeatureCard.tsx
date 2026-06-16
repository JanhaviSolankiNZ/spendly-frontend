import type { LucideIcon } from "lucide-react";

const FeatureCard = ({  Icon, color, bg, title, description }: { Icon: LucideIcon; color: string; bg:string; title: string; description:string;  }) => {
    return (
         <div
          key={title}
          className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: bg }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
          <p className="text-xs text-secondary leading-relaxed">{description}</p>
        </div>
    );
};

export default FeatureCard;