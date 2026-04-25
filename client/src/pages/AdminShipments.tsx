import { useEffect, useState } from "react";
import { getAllShipments } from "@/services/shipmentService";
import type { Shipment } from "@/types/shipment";
import { ShipmentTable } from "@/components/admin/ShipmentTable";
import ShipmentForm from "@/components/admin/ShipmentForm";
import UpdateManager from "@/components/admin/UpdateManager";
import { Plus, Package } from "lucide-react"; // Added for professional touch

const AdminShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const data = await getAllShipments();
    setShipments(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <main className="p-8 space-y-8">

        {/* HEADER SECTION */}
        <div className="flex justify-between items-center bg-card p-6 border-2 border-border rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Package className="text-primary" size={28} /> Shipments
            </h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Manage and track global inventory
            </p>
          </div>

          <button
            onClick={() => setCreating(true)}
            className="bg-primary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Create Shipment
          </button>
        </div>

        {/* TABLE SECTION - Wrapped in a card for consistency */}
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
          <ShipmentTable shipments={shipments} onSelect={setSelected} />
        </div>

        {/* CREATE MODAL */}
        {creating && (
          <Modal onClose={() => setCreating(false)}>
            <div className="mb-6">
               <h2 className="text-xl font-black uppercase tracking-tight">Register Shipment</h2>
               <p className="text-[10px] text-muted-foreground font-bold uppercase">Enter manifest details below</p>
            </div>
            <ShipmentForm
              onSuccess={() => {
                setCreating(false);
                load();
              }}
            />
          </Modal>
        )}

        {/* UPDATE MANAGER (STATUS UPDATER) */}
        {selected && (
          <Modal onClose={() => setSelected(null)}>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Tracking</p>
                <h2 className="text-xl font-black text-primary font-mono">{selected.trackingNumber}</h2>
              </div>
            </div>
            <UpdateManager shipment={selected} refresh={load} />
          </Modal>
        )}
      </main>
    </div>
  );
};

/* MODAL COMPONENT - Updated with semantic bg-card and solid border-2 */
const Modal = ({ children, onClose }: any) => (
  <div
    className="fixed inset-0 z-[150] flex items-center justify-center p-4"
  >
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-muted/70 backdrop-blur-sm transition-opacity" 
      onClick={onClose} 
    />
    
    {/* Content Container */}
    <div
      className="relative bg-card border-2 border-border p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Optional Close X icon could go here */}
      {children}
    </div>
  </div>
);

export default AdminShipments;