import { useState, useEffect, type ReactNode } from "react";
import {
  Package,
  Activity,
  Bell,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  Maximize2,
  TrendingUp,
} from "lucide-react";
import { API } from "@/services/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShipments from "./AdminShipments";
import AdminSettings from "./AdminSettings";
import CreateShipmentModal from "../components/admin/CreateShipmentModal";
import SubscriberTable from "../components/admin/SubscriberTable";
import UserTable from "../components/admin/UserTable";
import type { Shipment } from "../types/shipment";

type Stats = {
  total: number;
  inTransit: number;
  delivered: number;
  attention: number;
};

const AdminDashboard = () => {
  const storedUser = localStorage.getItem('userInfo');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isOwner = currentUser?.role?.toString().toLowerCase() === 'owner';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    attention: 0,
  });

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Shipment[]>("/shipments");
      setShipments(data);
      setStats({
        total: data.length,
        inTransit: data.filter((s: Shipment) => s.status === "In Transit")
          .length,
        delivered: data.filter((s: Shipment) => s.status === "Delivered")
          .length,
        attention: data.filter(
          (s: Shipment) => s.status === "On Hold" || s.status === "Delayed",
        ).length,
      });
    } catch (error) {
      console.error("Error fetching shipments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <StatCard
                label="Total Shipments"
                value={stats.total}
                icon={<Package className="text-amber-500" />}
                color="amber"
              />
              <StatCard
                label="Delivered"
                value={stats.delivered}
                icon={<CheckCircle className="text-emerald-500" />}
                color="emerald"
              />
              <StatCard
                label="In Transit"
                value={stats.inTransit}
                icon={<Activity className="text-blue-500" />}
                color="blue"
              />
              <StatCard
                label="On Hold"
                value={stats.attention}
                icon={<Bell className="text-orange-500" />}
                color="orange"
                alert
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-xl">Recent Shipments</h3>
                    <button className="text-red-600 text-sm font-bold">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="p-10 text-center animate-pulse font-mono">
                        LOADING DATA...
                      </div>
                    ) : (
                      shipments
                        .slice(0, 5)
                        .map((s) => (
                          <ShipmentRow key={s.trackingNumber} shipment={s} />
                        ))
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="font-black text-xl mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <QuickActionBtn
                      label="Add Shipment"
                      icon={<Plus className="text-red-500" />}
                      onClick={() => setIsModalOpen(true)}
                    />
                    <QuickActionBtn
                      label="Scan & Update"
                      icon={<Maximize2 className="text-blue-500" />}
                    />
                    <QuickActionBtn
                      label="Bulk Upload"
                      icon={<TrendingUp className="text-emerald-500" />}
                    />
                    <QuickActionBtn
                      label="Reports"
                      icon={<Clock className="text-purple-500" />}
                    />
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black">Recent Activity</h3>
                    <button className="text-red-600 text-xs font-bold">
                      View All
                    </button>
                  </div>
                  <div className="space-y-6">
                    {shipments.slice(0, 3).map((s, idx) => (
                      <ActivityItem key={idx} shipment={s} />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        );
      case "Shipments":
        return <AdminShipments />;
      case "Subscribers":
        return <SubscriberTable />;
      case "Users":
        return isOwner ? <UserTable /> : null;
      case "Settings":
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground transition-colors duration-300">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} isOwner={isOwner} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-2xl font-black">{activeTab}</h1>
            <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">{renderTabContent()}</div>

        <CreateShipmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={fetchShipments}
        />
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ShipmentRow = ({ shipment }: { shipment: Shipment }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-full ${
          shipment.status === "Delivered"
            ? "bg-emerald-50 text-emerald-600"
            : shipment.status === "On Hold"
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
        }`}
      >
        {shipment.status === "Delivered" ? (
          <CheckCircle size={20} />
        ) : (
          <Package size={20} />
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm md:text-base">
          {shipment.trackingNumber}
        </h4>
        <p className="text-xs text-zinc-500">
          {shipment.origin} • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span
        className={`hidden md:block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          shipment.status === "Delivered"
            ? "bg-emerald-100 text-emerald-700"
            : shipment.status === "On Hold"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
        }`}
      >
        {shipment.status}
      </span>
      <ChevronRight
        size={18}
        className="text-zinc-400 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
  alert,
  color,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  alert?: boolean;
  color: string;
}) => {
  // Map color names to Tailwind classes to ensure they work with build-time purging
  const colorMap: Record<string, string> = {
    amber: "bg-amber-50 dark:bg-amber-900/20",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20",
    blue: "bg-blue-50 dark:bg-blue-900/20",
    orange: "bg-orange-50 dark:bg-orange-900/20",
  };

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border rounded-3xl p-5 shadow-sm ${
        alert
          ? "border-red-200 dark:border-red-500/40"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div
        className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || "bg-zinc-100"}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-black">{value.toLocaleString()}</p>
      <p className="text-[10px] md:text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};

const QuickActionBtn = ({ label, icon, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-red-500 transition-all text-left"
  >
    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">{icon}</div>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const ActivityItem = ({ shipment }: { shipment: Shipment }) => (
  <div className="flex gap-4 relative">
    <div className="flex flex-col items-center">
      <div
        className={`w-2 h-2 rounded-full mt-1 ${shipment.status === "Delivered" ? "bg-emerald-500" : "bg-blue-500"}`}
      />
      <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
    <div className="pb-6">
      <p className="text-xs font-medium">
        Shipment <span className="font-bold">{shipment.trackingNumber}</span>{" "}
        updated to <span className="font-bold">{shipment.status}</span>
      </p>
      <p className="text-[10px] text-zinc-500 mt-1">Recently updated</p>
    </div>
  </div>
);

export default AdminDashboard;
