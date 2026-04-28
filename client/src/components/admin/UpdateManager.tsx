import { useState, useEffect, useCallback } from 'react';
import { addUpdate, getUpdates, deleteUpdate } from '@/services/shipmentService';
import type { Shipment, ShipmentUpdate, ShipmentStatus } from '@/types/shipment';
import { MapPin, FileText, Trash2, Send, Clock, Activity, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

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

  // Pass tracking number to API endpoints that expect it
  const loadUpdates = useCallback(async () => {
    if (!shipment?.trackingNumber) return;
    try {
      // Backend routes expect tracking number, not MongoDB _id
      const data = await getUpdates(shipment.trackingNumber);
      const sorted = data.sort((a: ShipmentUpdate, b: ShipmentUpdate) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setUpdates(sorted);
    } catch (err) {
      console.error('Failed to load updates:', err);
    }
  }, [shipment?.trackingNumber]);

  useEffect(() => {
    if (shipment?.trackingNumber) loadUpdates();
  }, [shipment?.trackingNumber, loadUpdates]);

  const handleAddUpdate = async () => {
    if (!updateData.location.trim()) {
      toast.error('Current location is required');
      return;
    }

    if (!shipment?.trackingNumber) {
      toast.error('Internal Error: Shipment tracking number missing');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status: updateData.status || 'In Transit',
        location: updateData.location.trim(),
        description: updateData.description.trim() || "Status updated successfully"
      };

      // Pass tracking number to match backend route expectations
      await addUpdate(shipment.trackingNumber, payload);
      
      setUpdateData({ status: 'In Transit', location: '', description: '' });
      await loadUpdates();
      refresh(); 
      toast.success('Shipment telemetry updated.');
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.message;
      toast.error(`Update Failed: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Permanently remove this event from history?')) return;
    if (!shipment?.trackingNumber) return;
    
    try {
      // Pass tracking number to match backend route parameter expectations
      await deleteUpdate(shipment.trackingNumber, updateId); 
      await loadUpdates();
      refresh();
      toast.success('Event deleted');
    } catch (err: any) {
      const msg = err.response?.data?.message || "Check backend routes";
      toast.error(`Delete failed: ${msg}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity size={20} className="text-red-600" />
        <h3 className="text-xl font-black dark:text-white text-zinc-900">Telemetry Manager</h3>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Event Status</label>
            <select
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
              value={updateData.status}
              onChange={(e) => setUpdateData({...updateData, status: e.target.value as ShipmentStatus})}
            >
              {['Picked Up', 'In Transit', 'Processing', 'Out for Delivery', 'Delivered', 'On Hold', 'Delayed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Current Location</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 pl-10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Ikeja, Lagos"
                value={updateData.location}
                onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Notes / Description</label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-4 text-zinc-400" />
            <textarea
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 pl-10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide more details..."
              value={updateData.description}
              onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
              rows={2}
            />
          </div>
        </div>

        <button
          onClick={handleAddUpdate}
          disabled={loading}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="animate-spin" size={18}/> : <Send size={18}/>}
          {loading ? 'TRANSMITTING...' : 'PUSH UPDATE'}
        </button>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Update History</h4>
        {updates.length === 0 && <p className="text-xs text-zinc-500 italic ml-1">No telemetry data recorded yet.</p>}
        {updates.map((update) => (
          <div key={update._id} className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center transition-all hover:border-red-500/50">
            <div className="flex gap-4">
              <div className={`w-1 h-10 rounded-full ${['On Hold', 'Delayed'].includes(update.status) ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm">{update.status}</span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-bold">
                    <Clock size={10} /> {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium">{update.location}</p>
                {update.description && <p className="text-xs text-zinc-400 mt-1 italic">"{update.description}"</p>}
              </div>
            </div>
            <button
              onClick={() => handleDeleteUpdate(update._id!)}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateManager;