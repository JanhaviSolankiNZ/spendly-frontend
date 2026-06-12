import { currentMonth, formatMonthLabel } from "@/utils/helpers";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface SparkTooltipProps {
  active?:  boolean;
  payload?: Array<{ value: number }>;
  label?:   string | number;
}

const SparkTooltip = ({ active, payload, label }: SparkTooltipProps) => {
if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs shadow-lg">
      {label && (
        <p className="text-secondary mb-0.5">Day {label}</p>
      )}
      <p className="text-muted-foreground font-medium">
        ${payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
}

const SparklineCard = ({
  dailyExpenses, daysInMonth,
}: {
  dailyExpenses: Array<{ day: number; total: number }>;
  daysInMonth:   number;
}) => {

    // fill missing days with 0 so the chart is continuous
  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const found = dailyExpenses.find((d) => d.day === i + 1);
    return { day: i + 1, total: found?.total ?? 0 };
  });

  // highest single-day spend
  const peak = data.reduce(
    (max, d) => (d.total > max.total ? d : max),
    { day: 0, total: 0 }
  );


  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Daily spending
          </p>
          <p className="text-xs text-secondary mt-0.5">
            {formatMonthLabel(currentMonth())}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary">Peak day</p>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Day {peak.day} · ${peak.total.toLocaleString()}
          </p>
        </div>
      </div>

      {data.every((d) => d.total === 0) ? (
        <div className="flex items-center justify-center h-16 text-secondary">
          <p className="text-xs">No spending data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#5DCAA5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5DCAA5" stopOpacity={0}   />
              </linearGradient>
            </defs>

            <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStart"
                tickFormatter={(v) => String(v)}
            />

            <Tooltip
                content={<SparkTooltip />}
                cursor={false}
                position={{ y: -10 }}
                offset={0}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#5DCAA5"
              strokeWidth={1.5}
              fill="url(#sparkGradient)"
              dot={false}
              activeDot={{ r: 3, fill: "#5DCAA5", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* day markers at bottom */}
      {/* <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-secondary">1</span>
        <span className="text-[10px] text-secondary">
          {Math.floor(daysInMonth / 2)}
        </span>
        <span className="text-[10px] text-secondary">{daysInMonth}</span>
      </div> */}
    </div>
  )
}

export default SparklineCard
