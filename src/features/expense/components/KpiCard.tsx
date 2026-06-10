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

export default KpiCard
