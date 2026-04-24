import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, MapPin, Clock, PackageCheck } from "lucide-react";
import { API } from "@/services/api";

type Event = {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
};

type Shipment = {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  recipientName: string;
  serviceType: string;
  weight: string;
  events: Event[];
};

const Track = () => {
  const { trackingNumber } = useParams();
  const [data, setData] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trackingNumber) fetchShipment(trackingNumber);
  }, [trackingNumber]);

  const fetchShipment = async (id: string) => {
    try {
      const res = await API.get(`/shipments/${id}`);
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading shipment...</div>;
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Shipment not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            Tracking: {data.trackingNumber}
          </h1>
          <p className="text-muted-foreground mt-1">
            {data.origin} → {data.destination}
          </p>
        </div>

        {/* Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <p className="label">Status</p>
            <p className="value">{data.status}</p>
          </div>
          <div className="card">
            <p className="label">Current Location</p>
            <p className="value">{data.currentLocation}</p>
          </div>
          <div className="card">
            <p className="label">Estimated Delivery</p>
            <p className="value">{data.estimatedDelivery}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Shipment History</h2>

          <div className="relative border-l border-border pl-6 space-y-6">
            {data.events.map((event, index) => (
              <div key={index} className="relative animate-fade-in-up">

                {/* Dot */}
                <div className="absolute -left-[10px] top-1.5 h-4 w-4 rounded-full bg-primary"></div>

                <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{event.status}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </p>

                  {event.note && (
                    <p className="text-xs mt-2 text-muted-foreground">
                      {event.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Track;