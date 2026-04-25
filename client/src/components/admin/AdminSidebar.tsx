import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-card h-screen border-r border-border p-6 flex flex-col sticky top-0">
      <div className="mb-10">
        <h2 className="text-xl font-black text-primary tracking-tighter">
          SUBMIT <span className="text-foreground">SPEED</span>
        </h2>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          Control Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={activeTab === "Dashboard"}
          onClick={() => onTabChange("Dashboard")}
        />
        <NavItem
          icon={<Package size={20} />}
          label="Shipments"
          active={activeTab === "Shipments"}
          onClick={() => onTabChange("Shipments")}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          active={activeTab === "Settings"}
          onClick={() => onTabChange("Settings")}
        />
      </nav>

      <div className="pt-6 border-t border-border">
        <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={20} />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default AdminSidebar;
