export function SpendlyLogo({ className }: {className: string;}) {
  return (
     <svg
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0" y="0" width="200" height="180" rx="70" fill="#5DCAA5"/>
      <circle cx="100" cy="90" r="40" fill="#5DCAA5" stroke="#04342C" strokeWidth="9"/>
      <text x="100" y="90" textAnchor="middle" dominantBaseline="central" fontFamily="Georgia, serif" fontSize="58" fontWeight="bolder" fill="#04342C">$</text>
    </svg>
  );
}