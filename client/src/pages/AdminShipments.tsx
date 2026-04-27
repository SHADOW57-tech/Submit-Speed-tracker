import { useEffect, useState, useCallback } from "react";
import { getAllShipments } from "@/services/shipmentService";
import type { Shipment } from "@/types/shipment";
import { ShipmentTable } from "@/components/admin/ShipmentTable";
import UpdateManager from "@/components/admin/UpdateManager";
import CreateShipmentModal from "@/components/admin/CreateShipmentModal"; // Import your component
import { Plus, Package } from "lucide-react";

const AdminShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selected, setSelected] = useState<Shipment | null>(null);
  
  // THIS IS THE KEY: State to toggle the modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);

  const load = useCallback(async () => {
    const data = await getAllShipments();
    setShipments(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen">
      <main className="p-4 sm:p-8 space-y-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-card p-6 border-2 border-border rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Package className="text-red-600" size={28} /> Shipments
            </h1>
          </div>

          {/* BUTTON: No routing, just sets state to true */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Create Shipment
          </button>
        </div>

        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
          <ShipmentTable shipments={shipments} onSelect={setSelected} />
        </div>

        {/* CREATE MODAL: Passes the state and the refresh function */}
        <CreateShipmentModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          onCreated={() => {
            setShowCreateModal(false);
            load(); // Refresh the list automatically after creation
          }} 
        />

        {/* UPDATE MANAGER MODAL (Status updates for existing shipments) */}
        {selected && (
          <Modal onClose={() => setSelected(null)}>
             <UpdateManager shipment={selected} refresh={load} />
          </Modal>
        )}
      </main>
    </div>
  );
};




/* MODAL COMPONENT - Updated with semantic bg-card and solid border-2 */
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => (
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