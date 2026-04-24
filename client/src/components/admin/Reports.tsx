import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

type Stats = {
  deliveryRate: number;
  delivered: number;
  inTransit: number;
  delayed: number;
  pending: number;
  total: number;
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub: string;
};

const Reports = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get<Stats>(
        "http://localhost:5000/api/shipments/stats/analytics"
      );
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats)
    return <div className="text-zinc-500">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 className="text-blue-500" />}
          label="Delivery Success"
          value={`${stats.deliveryRate}%`}
          sub="Overall rate"
        />

        <StatCard
          icon={<CheckCircle2 className="text-green-500" />}
          label="Completed"
          value={stats.delivered}
          sub="Successfully delivered"
        />

        <StatCard
          icon={<Clock className="text-yellow-500" />}
          label="In Motion"
          value={stats.inTransit}
          sub="Currently moving"
        />

        <StatCard
          icon={<AlertTriangle className="text-red-500" />}
          label="Delayed"
          value={stats.delayed}
          sub="Requires attention"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-bold">Operational Volume</h3>
            <p className="text-zinc-500 text-sm">
              Real-time capacity tracking
            </p>
          </div>

          <p className="text-2xl font-black text-white">
            {stats.total}{" "}
            <span className="text-xs text-zinc-500 uppercase">
              Total Units
            </span>
          </p>
        </div>

        <div className="w-full h-4 bg-black rounded-full overflow-hidden flex">
          <div
            style={{
              width: `${(stats.delivered / stats.total) * 100}%`,
            }}
            className="h-full bg-green-500"
          />

          <div
            style={{
              width: `${(stats.inTransit / stats.total) * 100}%`,
            }}
            className="h-full bg-blue-500"
          />

          <div
            style={{
              width: `${(stats.pending / stats.total) * 100}%`,
            }}
            className="h-full bg-yellow-500"
          />

          <div
            style={{
              width: `${(stats.delayed / stats.total) * 100}%`,
            }}
            className="h-full bg-red-500"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: StatCardProps) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-black rounded-lg">{icon}</div>

      <TrendingUp
        size={16}
        className="text-zinc-700 group-hover:text-zinc-400"
      />
    </div>

    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
      {label}
    </p>

    <p className="text-2xl font-black mt-1">{value}</p>

    <p className="text-zinc-600 text-[10px] mt-1 italic">{sub}</p>
  </div>
);

export default Reports;