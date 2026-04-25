
import type { ShipmentUpdate } from '../types/shipment';

const Timeline = ({ updates }: { updates: ShipmentUpdate[] }) => {
  return (
    <div className="space-y-6 border-l-2 border-red-500 ml-4">
      {updates.map((update, index) => (
        <div key={update._id || index} className="relative pl-8">
          <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-500/50"></div>
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <h4 className="text-white font-bold">{update.status}</h4>
            <p className="text-zinc-400 text-sm">{update.location}</p>
            <p className="text-zinc-500 text-xs mt-1">
              {new Date(update.timestamp).toLocaleString()}
            </p>
            {update.description && (
              <p className="text-zinc-300 text-sm mt-2">{update.description}</p>
            )}
          </div>
        </div>
      ))}
      {updates.length === 0 && (
        <div className="text-center text-zinc-500 py-8">No updates available yet</div>
      )}
    </div>
  );
};

export default Timeline;