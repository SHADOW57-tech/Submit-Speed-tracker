import { Edit2, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import type { Shipment } from "@/types/shipment";

export const ShipmentTable = ({
  shipments,
  onSelect,
  onEdit,
  onDelete,
}: {
  shipments: Shipment[];
  onSelect?: (s: Shipment) => void;
  onEdit?: (s: Shipment) => void;
  onDelete?: (s: Shipment) => void;
}) => {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
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
            <tr
              key={s._id}
              className="border-t hover:bg-muted cursor-pointer"
              onClick={() => onSelect?.(s)}
            >
              <td className="p-3 font-mono">{s.trackingNumber}</td>

              <td className="p-3">
                {s.origin} → {s.destination}
              </td>

              <td className="p-3">
                <StatusBadge status={s.status} />
              </td>

              <td className="p-3 text-right flex gap-2 justify-end">
                {onEdit && (
                  <button
                    onClick={() => onEdit(s)}
                    className="p-2 rounded-md hover:bg-muted"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(s)}
                    className="p-2 rounded-md hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};