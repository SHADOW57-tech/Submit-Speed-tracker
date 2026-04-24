import React, { useState, useEffect } from "react";
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
import axios from "axios";
import CreateShipmentModal from "../components/admin/CreateShipmentModal";

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    attention: 0,
  });

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/shipments");
      setShipments(data);
      setStats({
        total: data.length,
        inTransit: data.filter((s: any) => s.status === "In Transit").length,
        delivered: data.filter((s: any) => s.status === "Delivered").length,
        attention: data.filter(
          (s: any) => s.status === "On Hold" || s.status === "Delayed",
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
            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
              className="shadow-sm border border-border shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
                label="Total Shipments"
                value={stats.total}
                sub="Total in database"
                icon={<Package />}
              />
              <StatCard
              className="shadow-sm border border-border shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
                label="In Transit"
                value={stats.inTransit}
                sub="Active on route"
                icon={<Activity />}
              />
              <StatCard
              className="shadow-sm border border-border shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
                label="Delivered"
                value={stats.delivered}
                sub="Successful handovers"
                icon={<RefreshCcw />}
              />
              <StatCard
              className="shadow-sm border border-border shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
                label="Attention Needed"
                value={stats.attention}
                sub="Hold or Delay alerts"
                icon={<Bell />}
                alert
              />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <InventoryTable
                  shipments={shipments}
                  loading={loading}
                  onRefresh={fetchShipments}
                />
              </div>
              <div className="lg:col-span-1">
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
          <div className="card max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Admin Config</h2>
            <p className="text-sm text-muted-foreground">
              Global tracking prefix:{" "}
              <span className="font-mono text-primary font-bold">SS-</span>
            </p>
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <p className="text-xs font-bold uppercase opacity-50">
                System Status
              </p>
              <p className="text-sm font-bold text-status-success">
                Node Connected: MongoDB Atlas Primary
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border bg-card p-4 hidden lg:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-1.5 rounded shadow-lg shadow-primary/20">
            <Ship size={20} className="text-primary-foreground" />
          </div>
          <span className="font-black tracking-tighter text-lg italic">
            SUBMIT SPEED
          </span>
        </div>
        <div className="space-y-6">
          <nav className="space-y-1">
            <p className="label px-3 mb-2">Workspace</p>
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={activeTab === "Dashboard"}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Package size={18} />}
              label="Shipments"
              active={activeTab === "Shipments"}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Activity size={18} />}
              label="Tracking Updates"
              active={activeTab === "Updates"}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Users size={18} />}
              label="Customers"
              active={activeTab === "Users"}
              onClick={setActiveTab}
            />
          </nav>
          <nav className="space-y-1">
            <p className="label px-3 mb-2">Operations</p>
            <NavItem
              icon={<BarChart3 size={18} />}
              label="Reports"
              active={activeTab === "Reports"}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Settings size={18} />}
              label="Settings"
              active={activeTab === "Settings"}
              onClick={setActiveTab}
            />
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
            <LayoutDashboard size={14} className="text-primary" /> Admin Console
            / <span className="text-foreground">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border border-border px-3 py-1.5 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></span>{" "}
              Admin session active
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                Internal Logistics Terminal
              </p>
              <h1 className="text-4xl font-black tracking-tighter uppercase">
                Dashboard Operations
              </h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary h-fit px-6 py-3 shadow-lg shadow-primary/25"
            >
              <Plus size={18} className="mr-2" /> Create shipment
            </button>
          </div>
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

// --- SUB-COMPONENTS ---

const InventoryTable = ({ shipments, loading, onRefresh, fullView }: any) => (
  <div className={`card ${fullView ? "min-h-[500px]" : ""}`}>
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold">Active Inventory</h3>
      <button
        onClick={onRefresh}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
    <div className="space-y-3">
      {shipments.length === 0 ? (
        <div className="text-center py-12 italic opacity-40">
          No records found.
        </div>
      ) : (
        shipments.map((s: any) => (
          <div
            key={s._id}
            className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-all cursor-pointer group bg-background/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              <span className="font-mono font-bold text-xs group-hover:text-primary transition-colors">
                {s.trackingId}
              </span>
            </div>
            <span
              className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${s.status === "Delivered" ? "bg-status-success/10 text-status-success" : "bg-muted text-muted-foreground"}`}
            >
              {s.status}
            </span>
            <ChevronRight size={14} className="text-muted-foreground/40" />
          </div>
        ))
      )}
    </div>
  </div>
);

const CustomerView = ({ shipments }: any) => {
  const uniqueCustomers = Array.from(
    new Set(shipments.map((s: any) => s.recipientEmail)),
  ).map((email) => shipments.find((s: any) => s.recipientEmail === email));

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-muted/50 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
          <tr>
            <th className="px-6 py-4">Client Name</th>
            <th className="px-6 py-4">Email Access</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {uniqueCustomers.map((c: any) => (
            <tr
              key={c._id}
              className="text-sm hover:bg-muted/30 transition-colors"
            >
              <td className="px-6 py-4 font-bold">{c.recipientName}</td>
              <td className="px-6 py-4 font-mono text-muted-foreground">
                {c.recipientEmail}
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold bg-status-info/10 text-status-info px-2 py-1 rounded">
                  Active User
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ReportsView = ({ stats }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="card p-8 flex flex-col items-start">
      <TrendingUp className="text-primary mb-4" size={32} />
      <h3 className="text-4xl font-black mb-1">
        {((stats.delivered / stats.total) * 100 || 0).toFixed(1)}%
      </h3>
      <p className="label">Efficiency Rating</p>
    </div>
    <div className="card p-8 flex flex-col items-start">
      <ClipboardList className="text-status-info mb-4" size={32} />
      <h3 className="text-4xl font-black mb-1">{stats.total}</h3>
      <p className="label">Total Operations Logged</p>
    </div>
  </div>
);

const ActivityFeed = ({ shipments }: any) => (
  <div className="card">
    <h3 className="font-bold mb-6 text-sm">Real-time Feed</h3>
    <div className="space-y-6">
      {shipments.slice(0, 4).map((s: any) => (
        <div key={s._id} className="border-l-2 border-primary pl-4 py-1">
          <p className="text-[10px] font-bold text-muted-foreground">
            {s.trackingId}
          </p>
          <p className="text-xs font-black">{s.status}</p>
          <p className="text-[10px] text-muted-foreground/60">
            {s.currentLocation || "Processing"}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={() => onClick(label)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const StatCard = ({ label, value, sub, icon, alert }: any) => (
  <div
    className={`card group hover:-translate-y-1 ${
      alert ? "border-status-danger/30 shadow-status-danger/5" : ""
    }`}
  >
    <div className="flex justify-between items-start w-full">
      <div className="flex flex-col">
        <p className="label">{label}</p>
        <p className={`text-3xl font-black tracking-tighter mt-1 ${alert ? "text-status-danger" : "text-foreground"}`}>
          {value}
        </p>
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
        alert ? "bg-status-danger/10 text-status-danger" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      }`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
    </div>
    <p className="text-[10px] font-bold text-muted-foreground leading-tight mt-4">{sub}</p>
  </div>
);
export default AdminDashboard;
