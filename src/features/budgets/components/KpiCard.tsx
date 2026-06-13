const KpiCard = ({
  label, value, sub, valueColor,
}: {
  label: string; value: string; sub: string; valueColor: string;
}) => {
  return (
    <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
      <p className="text-xs text-secondary mb-1.5">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="text-xs text-secondary mt-1.5">{sub}</p>
    </div>
  );
}

export default KpiCard
