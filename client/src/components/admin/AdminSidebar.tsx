import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Users,
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-zinc-950 h-screen border-r border-zinc-800 p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-xl font-black text-red-600 tracking-tighter">
          SUBMIT <span className="text-white">SPEED</span>
        </h2>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          Control Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active
        />
        <NavItem icon={<Package size={20} />} label="Shipments" />
        <NavItem icon={<Users size={20} />} label="Customers" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div className="pt-6 border-t border-zinc-800">
        <button className="flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-900 hover:text-white"}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default AdminSidebar;
