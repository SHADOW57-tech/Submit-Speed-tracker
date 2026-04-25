import { useState, useEffect } from 'react';
import { addUpdate, getUpdates, deleteUpdate } from '@/services/shipmentService';
import type { Shipment, ShipmentUpdate, ShipmentStatus } from '@/types/shipment';

interface Props {
  shipment: Shipment;
  refresh: () => void;
}

const UpdateManager = ({ shipment, refresh }: Props) => {
  const [updates, setUpdates] = useState<ShipmentUpdate[]>([]);
  const [updateData, setUpdateData] = useState({
    status: 'In Transit' as ShipmentStatus,
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAddUpdate = async () => {
    if (!updateData.location.trim()) {
      alert('Location is required');
      return;
    }

    setLoading(true);
    try {
      await addUpdate(shipment._id!, updateData);
      alert('Update added successfully!');
      setUpdateData({ status: 'In Transit', location: '', description: '' });
      const data = await getUpdates(shipment._id!);
      setUpdates(data);
      refresh();
    } catch (_err) {
      console.error('Error adding update:', _err);
      alert('Error adding update. Ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      await deleteUpdate(updateId);
      const data = await getUpdates(shipment._id!);
      setUpdates(data);
      refresh();
    } catch (_err) {
      console.error('Error deleting update:', _err);
      alert('Error deleting update');
    }
  };

  // Load updates when component mounts
  useEffect(() => {
    const loadUpdates = async () => {
      const data = await getUpdates(shipment._id!);
      setUpdates(data);
    };
    loadUpdates();
  }, [shipment._id]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Shipment Timeline</h3>

      {/* Add Update Form */}
      <div className="bg-zinc-800 p-4 rounded-xl space-y-3">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Add Status Update</h4>
        <select
          className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
          value={updateData.status}
          onChange={(e) => setUpdateData({...updateData, status: e.target.value as ShipmentStatus})}
        >
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived at Hub">Arrived at Hub</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="On Hold">On Hold</option>
          <option value="Delayed">Delayed</option>
        </select>
        <input
          className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
          placeholder="Current Location (City, Country)"
          value={updateData.location}
          onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
        />
        <textarea
          className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
          placeholder="Description (optional)"
          value={updateData.description}
          onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
          rows={2}
        />
        <button
          onClick={handleAddUpdate}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-bold hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Post Update'}
        </button>
      </div>

      {/* Updates List */}
      <div className="space-y-2">
        {updates.map((update) => (
          <div key={update._id} className="bg-zinc-800 p-3 rounded-lg flex justify-between items-start">
            <div>
              <div className="font-semibold">{update.status}</div>
              <div className="text-sm text-zinc-400">{update.location}</div>
              <div className="text-xs text-zinc-500">
                {new Date(update.timestamp).toLocaleString()}
              </div>
              {update.description && (
                <div className="text-sm mt-1">{update.description}</div>
              )}
            </div>
            <button
              onClick={() => handleDeleteUpdate(update._id!)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        {updates.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No updates yet</div>
        )}
      </div>
    </div>
  );
};

export default UpdateManager;