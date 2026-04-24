import { type Edit2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { type Shipment } from "@/types/shipment";

export const ShipmentTable = ({
  shipments,
  onEdit,
  onDelete,
}: {
  shipments: Shipment[];
  onEdit: (s: Shipment) => void;
  onDelete: (s: Shipment) => void;
}) => {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Tracking</th>
            <th className="p-3 text-left">Route</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {shipments.map((s) => (
            <tr key={s._id} className="border-t hover:bg-muted">
              <td className="p-3 font-mono">{s.trackingNumber}</td>

              <td className="p-3">
                {s.origin} → {s.destination}
              </td>

              <td className="p-3">
                <StatusBadge status={s.status} />
              </td>

              <td className="p-3 text-right flex gap-2 justify-end">
                <button
                  onClick={() => onEdit(s)}
                  className="p-2 rounded-md hover:bg-muted"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onDelete(s)}
                  className="p-2 rounded-md hover:bg-red-100 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};