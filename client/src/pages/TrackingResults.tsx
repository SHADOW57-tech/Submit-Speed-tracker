import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../services/api';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import type { ShipmentUpdate, Shipment } from '../types/shipment';
import { MapPin, Calendar, Truck, User, Package, Route } from 'lucide-react';

const TrackingResults = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [updates, setUpdates] = useState<ShipmentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shipmentId = id?.trim() ?? '';
    const fetchData = async () => {
      if (!shipmentId) return;
      try {
        const [shipmentRes, updatesRes] = await Promise.all([
          API.get(`/shipments/${encodeURIComponent(shipmentId)}`),
          API.get(`/shipments/${encodeURIComponent(shipmentId)}/updates`),
        ]);
        setShipment(shipmentRes.data);
        setUpdates(updatesRes.data);
      } catch {
        console.error('Shipment not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse dark:text-white">Scanning Global Network...</div>;
  if (!shipment) return <div className="p-20 text-center text-red-500 font-bold">Invalid Tracking ID</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">Track Your Shipment</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="md:col-span-1">
            <div className="bg-linear-to-br from-red-700 to-red-600 rounded-2xl p-6 text-white sticky top-6 shadow-xl">
              <div className="mb-6">
                <StatusBadge status={shipment.status} />
              </div>
              <div className="mb-8">
                <p className="text-sm text-red-100 font-bold uppercase tracking-wider mb-2">TRACKING NUMBER</p>
                <h2 className="text-4xl font-black font-mono">{shipment.trackingNumber}</h2>
              </div>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><MapPin className="inline w-4 h-4 mr-2" /> CURRENT LOCATION</p>
                  <p className="text-lg font-bold">{shipment.currentLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><Calendar className="inline w-4 h-4 mr-2" /> ESTIMATED DELIVERY</p>
                  <p className="text-lg font-bold">{shipment.estimatedDelivery || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><Truck className="inline w-4 h-4 mr-2" /> SERVICE</p>
                  <p className="text-lg font-bold">{shipment.serviceType}</p>
                </div>
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><User className="inline w-4 h-4 mr-2" /> RECIPIENT</p>
                  <p className="text-lg font-bold">{shipment.recipientName}</p>
                </div>
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><Route className="inline w-4 h-4 mr-2" /> ROUTE</p>
                  <p className="text-lg font-bold">{shipment.origin} → {shipment.destination}</p>
                </div>
                <div>
                  <p className="text-red-100 uppercase text-xs font-bold tracking-wider mb-2"><Package className="inline w-4 h-4 mr-2" /> WEIGHT</p>
                  <p className="text-lg font-bold">{shipment.weight} kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-transparent rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Shipment Progress</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">Detailed timeline of all tracking events.</p>
              <Timeline updates={updates} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrackingResults;