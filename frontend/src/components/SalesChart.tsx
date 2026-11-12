import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SalesChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#a58a5c" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#a58a5c" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#eeeae2" />

          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })
            }
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString('en-IN')}`,
              'Revenue',
            ]}
            labelFormatter={(label) =>
              new Date(`${label}T00:00:00`).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }
            contentStyle={{
              border: '1px solid #e8e5dd',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#a58a5c"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
