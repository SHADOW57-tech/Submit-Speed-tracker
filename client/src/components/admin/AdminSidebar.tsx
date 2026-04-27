import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Users,
  Bell,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwner?: boolean;
}

const AdminSidebar = ({ activeTab, onTabChange, isOwner = false }: AdminSidebarProps) => {
  return (
    <div className="w-full md:w-64 bg-card md:h-screen border-b md:border-r border-border p-6 flex flex-col md:sticky md:top-0">
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
          icon={<Bell size={20} />}
          label="Subscribers"
          active={activeTab === "Subscribers"}
          onClick={() => onTabChange("Subscribers")}
        />
        {isOwner && (
          <NavItem
            icon={<Users size={20} />}
            label="Users"
            active={activeTab === "Users"}
            onClick={() => onTabChange("Users")}
          />
        )}
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
