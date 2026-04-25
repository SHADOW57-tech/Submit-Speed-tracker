import React, { useState, useEffect, type ReactNode, type ReactElement } from "react";
import { type LucideProps } from 'lucide-react';
import {
  Package,
  Activity,
  Bell,
  Plus,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import { API } from "@/services/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShipments from "./AdminShipments";
import AdminSettings from "./AdminSettings";
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

type ActivityFeedProps = {
  shipments: Shipment[];
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
        inTransit: data.filter((s: Shipment) => s.status === "In Transit").length,
        delivered: data.filter((s: Shipment) => s.status === "Delivered").length,
        attention: data.filter((s: Shipment) => s.status === "On Hold" || s.status === "Delayed").length,
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
              <StatCard label="Total Shipments" value={stats.total} sub="Total in database" icon={<Package />} />
              <StatCard label="In Transit" value={stats.inTransit} sub="Active on route" icon={<Activity />} />
              <StatCard label="Delivered" value={stats.delivered} sub="Successful handovers" icon={<RefreshCcw />} />
              <StatCard label="Attention Needed" value={stats.attention} sub="Hold or Delay alerts" icon={<Bell />} alert />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <InventoryTable shipments={shipments} loading={loading} onRefresh={fetchShipments} />
              </div>
              <div>
                <ActivityFeed shipments={shipments} />
              </div>
            </div>
          </div>
        );
      case "Shipments": return <AdminShipments />;
      case "Settings": return <AdminSettings />;
      default: return null;
    }
  };

  return (
    /* Changed bg-zinc-900 to bg-background and text-white to text-foreground */
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        {/* Changed bg-zinc-800 to bg-card and border-zinc-700 to border-border */}
        <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-3xl font-black">{activeTab}</h1>

            {activeTab === "Dashboard" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Create Shipment
              </button>
            )}
          </div>
        </div>

        <div className="p-8 max-w-7xl">
          {renderTabContent()}
        </div>

        <CreateShipmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={fetchShipments}
        />
      </main>
    </div>
  );
};

const InventoryTable = ({ shipments, loading, onRefresh }: InventoryTableProps) => (
  /* Changed bg-zinc-800 to bg-card */
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
    <div className="flex justify-between mb-6">
      <h3 className="font-bold">Active Inventory</h3>
      <button onClick={onRefresh} className="text-muted-foreground hover:text-foreground transition-colors">
        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
      </button>
    </div>

    <div className="space-y-3">
      {shipments.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">No shipments found</div>
      ) : (
        shipments.map((s: Shipment) => (
          /* Changed bg-zinc-900 to bg-muted/50 and border-zinc-700 to border-border */
          <div
            key={s.trackingNumber}
            className="flex justify-between items-center bg-muted/30 border border-border rounded-lg p-4 hover:border-red-600 transition-colors"
          >
            <div>
              <div className="font-bold">{s.trackingNumber}</div>
              <div className="text-sm text-muted-foreground">{s.recipientName}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{s.status}</div>
                <div className="text-xs text-muted-foreground/60">{s.currentLocation}</div>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ActivityFeed = ({ shipments }: ActivityFeedProps) => (
  /* Changed bg-zinc-800 to bg-card */
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
    <h3 className="font-bold mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {shipments.slice(0, 5).map((s: Shipment) => (
        <div key={s.trackingNumber} className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="font-bold text-sm">{s.trackingNumber}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.status}</div>
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({ label, value, sub, icon, alert }: StatCardProps) => (
  /* Changed bg-zinc-800 to bg-card and border-zinc-700 to border-border */
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <h3 className={`text-3xl font-black mt-2 ${alert ? "text-red-500" : "text-foreground"}`}>
          {value}
        </h3>
      </div>
      <div className={alert ? "text-red-500" : "text-red-600"}>
        {React.cloneElement(icon as ReactElement<LucideProps>, { size: 24 })}
      </div>
    </div>
    <p className="text-xs text-muted-foreground/70 mt-3">{sub}</p>
  </div>
);

export default AdminDashboard;