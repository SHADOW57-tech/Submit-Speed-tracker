import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';

const TrackingResults = () => {
  const { id } = useParams(); // Gets the ID from the URL (/track/ID)
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shipments/${id}`);
        setShipment(res.data);
      } catch (err) {
        console.error("Not found");
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse">Scanning Global Network...</div>;
  if (!shipment) return <div className="p-20 text-center text-red-500 font-bold">Invalid Tracking ID</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card sticky top-24">
            <StatusBadge status={shipment.status} />
            <h2 className="text-3xl font-black mt-4 font-mono text-primary">{shipment.trackingNumber}</h2>
            <div className="mt-6 space-y-4">
               <div>
                 <p className="label">Origin</p>
                 <p className="font-bold">{shipment.origin}</p>
               </div>
               <div>
                 <p className="label">Destination</p>
                 <p className="font-bold">{shipment.destination}</p>
               </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-6">Transit Log</h3>
          <Timeline events={shipment.events} />
        </div>
      </div>
    </main>
  );
};

export default TrackingResults;