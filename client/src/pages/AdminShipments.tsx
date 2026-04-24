import { useEffect, useState } from "react";
import { getAllShipments } from "@/services/shipmentService";
import { Shipment } from "@/types/shipment";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ShipmentTable } from "@/components/admin/ShipmentTable";
import { ShipmentForm } from "@/components/admin/ShipmentForm";
import { EventManager } from "@/components/admin/EventManager";

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
    <div className="flex min-h-screen bg-background">

      <AdminSidebar />

      <main className="flex-1 p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Shipments</h1>

          <button
            onClick={() => setCreating(true)}
            className="btn-primary"
          >
            Create Shipment
          </button>
        </div>

        {/* TABLE */}
        <ShipmentTable shipments={shipments} onSelect={setSelected} />

        {/* CREATE MODAL */}
        {creating && (
          <Modal onClose={() => setCreating(false)}>
            <ShipmentForm
              onSuccess={() => {
                setCreating(false);
                load();
              }}
            />
          </Modal>
        )}

        {/* EVENT MANAGER */}
        {selected && (
          <Modal onClose={() => setSelected(null)}>
            <h2 className="font-bold mb-3">{selected.trackingNumber}</h2>
            <EventManager shipment={selected} refresh={load} />
          </Modal>
        )}
      </main>
    </div>
  );
};

const Modal = ({ children, onClose }: any) => (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center"
    onClick={onClose}
  >
    <div
      className="bg-card p-6 rounded-xl w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export default AdminShipments;