

const ChartCard = ({
  title, children, className,
}: {
  title: string; children: React.ReactNode; className?: string;
}) => {
  return (
    <div className={`bg-card rounded-xl p-4 sm:p-5 border border-border ${className ?? ""}`}>
      <p className="text-sm font-medium text-muted-foreground mb-4">{title}</p>
      {children}
    </div>
  );
}

export default ChartCard
