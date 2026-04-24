import React, { useState, useEffect, type ReactNode, type ReactElement } from "react";
import {
  LayoutDashboard,
  Package,
  Activity,
  Users,
  BarChart3,
  Settings,
  Bell,
  Plus,
  Ship,
  ChevronRight,
  RefreshCcw,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { API } from "@/services/api";
import CreateShipmentModal from "../components/admin/CreateShipmentModal";
import type { Shipment } from "../types/shipment";

type Stats = {
  total: number;
  inTransit: number;
  delivered: number;
  attention: number;
};

type InventoryTableProps = {
  shipments: Shipment[];
  loading: boolean;
  onRefresh: () => void;
  fullView?: boolean;
};

type CustomerViewProps = {
  shipments: Shipment[];
};

type ReportsViewProps = {
  stats: Stats;
};

type ActivityFeedProps = {
  shipments: Shipment[];
};

type NavItemProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: (tab: string) => void;
};

type StatCardProps = {
  label: string;
  value: string | number;
  sub: string;
  icon: ReactNode;
  alert?: boolean;
};

const AdminDashboard = () => {
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
      const { data } = await API.get<Shipment[]>('/shipments');

      setShipments(data);

      setStats({
        total: data.length,
        inTransit: data.filter(
          (s: Shipment) => s.status === "In Transit"
        ).length,
        delivered: data.filter(
          (s: Shipment) => s.status === "Delivered"
        ).length,
        attention: data.filter(
          (s: Shipment) =>
            s.status === "On Hold" || s.status === "Delayed"
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
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Shipments"
                value={stats.total}
                sub="Total in database"
                icon={<Package />}
              />

              <StatCard
                label="In Transit"
                value={stats.inTransit}
                sub="Active on route"
                icon={<Activity />}
              />

              <StatCard
                label="Delivered"
                value={stats.delivered}
                sub="Successful handovers"
                icon={<RefreshCcw />}
              />

              <StatCard
                label="Attention Needed"
                value={stats.attention}
                sub="Hold or Delay alerts"
                icon={<Bell />}
                alert
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <InventoryTable
                  shipments={shipments}
                  loading={loading}
                  onRefresh={fetchShipments}
                />
              </div>

              <div>
                <ActivityFeed shipments={shipments} />
              </div>
            </div>
          </div>
        );

      case "Shipments":
        return (
          <InventoryTable
            shipments={shipments}
            loading={loading}
            onRefresh={fetchShipments}
            fullView
          />
        );

      case "Users":
        return <CustomerView shipments={shipments} />;

      case "Reports":
        return <ReportsView stats={stats} />;

      case "Settings":
        return (
          <div className="card max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Admin Config</h2>
            <p className="text-sm text-muted-foreground">
              Global tracking prefix:
              <span className="font-mono text-primary font-bold ml-2">
                SS-
              </span>
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 border-r border-border bg-card p-4 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <Ship size={20} />
          <span className="font-black">SUBMIT SPEED</span>
        </div>

        <div className="space-y-2">
          <NavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={activeTab === "Dashboard"}
            onClick={setActiveTab}
          />

          <NavItem
            icon={<Package />}
            label="Shipments"
            active={activeTab === "Shipments"}
            onClick={setActiveTab}
          />

          <NavItem
            icon={<Users />}
            label="Users"
            active={activeTab === "Users"}
            onClick={setActiveTab}
          />

          <NavItem
            icon={<BarChart3 />}
            label="Reports"
            active={activeTab === "Reports"}
            onClick={setActiveTab}
          />

          <NavItem
            icon={<Settings />}
            label="Settings"
            active={activeTab === "Settings"}
            onClick={setActiveTab}
          />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black">{activeTab}</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-5 py-3"
          >
            <Plus size={16} className="inline mr-2" />
            Create Shipment
          </button>
        </div>

        {renderTabContent()}

        <CreateShipmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={fetchShipments}
        />
      </main>
    </div>
  );
};

const InventoryTable = ({
  shipments,
  loading,
  onRefresh,
  fullView,
}: InventoryTableProps) => (
  <div className={`card p-6 ${fullView ? "min-h-[500px]" : ""}`}>
    <div className="flex justify-between mb-6">
      <h3 className="font-bold">Active Inventory</h3>

      <button onClick={onRefresh}>
        <RefreshCcw
          size={16}
          className={loading ? "animate-spin" : ""}
        />
      </button>
    </div>

    <div className="space-y-3">
      {shipments.map((s: Shipment) => (
        <div
          key={s.trackingNumber}
          className="flex justify-between border rounded-xl p-4"
        >
          <span>{s.trackingNumber}</span>
          <span>{s.status}</span>
          <ChevronRight size={14} />
        </div>
      ))}
    </div>
  </div>
);

const CustomerView = ({ shipments }: CustomerViewProps) => (
  <div className="card p-6">
    {shipments.map((s: Shipment) => (
      <div key={s.trackingNumber} className="py-2 border-b">
        {s.recipientName}
      </div>
    ))}
  </div>
);

const ReportsView = ({ stats }: ReportsViewProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="card p-6">
      <TrendingUp />
      <h2 className="text-4xl font-black mt-4">
        {((stats.delivered / stats.total) * 100 || 0).toFixed(1)}%
      </h2>
    </div>

    <div className="card p-6">
      <ClipboardList />
      <h2 className="text-4xl font-black mt-4">{stats.total}</h2>
    </div>
  </div>
);

const ActivityFeed = ({ shipments }: ActivityFeedProps) => (
  <div className="card p-6">
    {shipments.slice(0, 4).map((s: Shipment) => (
      <div key={s.trackingNumber} className="mb-4">
        <p>{s.trackingNumber}</p>
        <p>{s.status}</p>
      </div>
    ))}
  </div>
);

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: NavItemProps) => (
  <button
    onClick={() => onClick(label)}
    className={`w-full flex gap-3 px-4 py-3 rounded-xl ${
      active ? "bg-primary text-white" : ""
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({
  label,
  value,
  sub,
  icon,
  alert,
}: StatCardProps) => (
  <div className="card p-6">
    <div className="flex justify-between">
      <div>
        <p>{label}</p>
        <h3 className={alert ? "text-red-500 text-3xl" : "text-3xl"}>
          {value}
        </h3>
      </div>

      {React.cloneElement(
        icon as ReactElement<{ size?: number }>,
        { size: 20 }
      )}
    </div>

    <p className="text-xs mt-3">{sub}</p>
  </div>
);

export default AdminDashboard;