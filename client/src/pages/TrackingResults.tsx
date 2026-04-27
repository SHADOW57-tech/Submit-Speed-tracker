import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../services/api";
import Timeline from "../components/Timeline";
import StatusBadge from "../components/StatusBadge";
import type { ShipmentUpdate, Shipment } from "../types/shipment";
import {
  Truck,
  AlertTriangle,
  Share2,
  Printer,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const TrackingResults = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [updates, setUpdates] = useState<ShipmentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // INTEGRATION: State for Subscription
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const shipmentId = id?.trim() ?? "";
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
        console.error("Shipment not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // INTEGRATION: Logic for Subscription
  const handleSubscribe = async () => {
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    setSubscribing(true);
    try {
      await API.post(`/shipments/${id}/subscribe`, { email });
      setIsSubscribed(true);
      setEmail("");
      toast.success("Successfully subscribed to updates!");
    } catch {
      toast.error("Subscription failed. Try again later.");
    } finally {
      setSubscribing(false);
    }
  };

  // INTEGRATION: Calculate Live Performance dynamically
  const calculatePerformance = () => {
    if (!shipment) return 0;
    if (shipment.status === "Delivered") return 100;
    if (shipment.status === "On Hold" || shipment.status === "Delayed")
      return 45;
    return 92;
  };

  const performance = calculatePerformance();

  const steps = [
    "Picked Up",
    "In Transit",
    "Processing",
    "Out for Delivery",
    "Delivered",
  ];
  const currentStepIndex = steps.indexOf(shipment?.status || "");

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse dark:text-white font-mono">
        INITIALIZING TELEMETRY...
      </div>
    );
  if (!shipment)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Invalid Tracking ID
      </div>
    );

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* TOP NAV BAR */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:underline">
            ← Back to Overview
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {/* MAIN SUMMARY HEADER CARD */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
          <div className="grid md:grid-cols-2 p-8 gap-8 items-center">
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">
                Tracking Number
              </p>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 font-mono">
                {shipment.trackingNumber}
              </h2>
              {(shipment.productName || shipment.senderName) && (
                <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {shipment.productName && (
                      <span className="block">
                        <strong>Product:</strong> {shipment.productName}
                      </span>
                    )}
                    {shipment.senderName && (
                      <span className="block">
                        <strong>From:</strong> {shipment.senderName}
                      </span>
                    )}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <StatusBadge status={shipment.status} />
                {(shipment.status === "On Hold" ||
                  shipment.status === "Delayed") && (
                  <span className="text-red-600 font-bold text-sm">
                    Delayed
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between border-l border-zinc-100 dark:border-zinc-800 pl-8">
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">
                  From
                </p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                  {shipment.origin}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">
                  To
                </p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                  {shipment.destination}
                </p>
              </div>
            </div>
          </div>

          {/* STEP PROGRESS BAR */}
          <div className="px-8 pb-10">
            <div className="relative flex justify-between">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0"></div>
              {steps.map((step, idx) => {
                const isCompleted =
                  idx < currentStepIndex || shipment.status === "Delivered";
                const isCurrent = idx === currentStepIndex;
                const isOnHold =
                  shipment.status === "On Hold" && idx === currentStepIndex;

                return (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        isOnHold
                          ? "bg-red-600 border-white text-white animate-pulse"
                          : isCompleted || (isCurrent && step === "Delivered")
                            ? "bg-green-500 border-white text-white"
                            : isCurrent
                              ? "bg-blue-600 border-white text-white animate-bounce"
                              : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 text-zinc-400"
                      }`}
                    >
                      {isOnHold ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </div>
                    <p
                      className={`text-[10px] font-black uppercase mt-2 ${
                        isCurrent
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ALERT BOX */}
        {shipment.status === "On Hold" && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex items-center justify-between mb-6">
            <div className="flex gap-4 items-center">
              <div className="bg-red-600 p-2 rounded-lg text-white">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-red-600">Shipment On Hold</h4>
                <p className="text-sm text-red-600/80">
                  Your shipment is currently held at customs in{" "}
                  {shipment.currentLocation}. Additional documentation may be
                  required.
                </p>
              </div>
            </div>
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition-colors">
              Contact Support
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                  All Shipment Updates
                </h3>
              </div>
              <Timeline updates={updates} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-xs">
                Shipment Details
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Service</span>
                  <span className="font-bold dark:text-white">
                    {shipment.serviceType}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Weight</span>
                  <span className="font-bold dark:text-white">
                    {shipment.weight} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Recipient</span>
                  <span className="font-bold dark:text-white">
                    {shipment.recipientName}
                  </span>
                </div>
              </div>
            </div>

            {/* INTEGRATED: LIVE PERFORMANCE CARD */}
            {/* INTEGRATED: LIVE PERFORMANCE CARD */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-xs">
                Live Performance
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 font-bold">
                    On-time Delivery
                  </p>
                  <p
                    className={`text-2xl font-black ${performance > 50 ? "text-green-500" : "text-red-500"}`}
                  >
                    {performance}%
                  </p>
                </div>

                {/* FIXED SVG PROGRESS CIRCLE */}
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle (Gray) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-zinc-100 dark:stroke-zinc-800"
                      strokeWidth="4"
                    />
                    {/* Progress Circle (Green/Red) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={performance > 50 ? "#10b981" : "#ef4444"}
                      strokeWidth="4"
                      strokeDasharray="100, 100"
                      strokeDashoffset={100 - performance}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Vehicle Icon Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Truck
                      size={20}
                      className={
                        performance > 50 ? "text-green-500" : "text-red-500"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* INTEGRATED: EMAIL UPDATES CARD */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl p-6 border border-yellow-100 dark:border-yellow-900/20">
              <h4 className="font-black text-zinc-900 dark:text-white mb-2 text-sm">
                Get Real-time Updates
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Receive live tracking updates directly on your device.
              </p>

              {isSubscribed ? (
                <div className="bg-green-500 text-white p-3 rounded-xl text-center text-xs font-bold animate-in zoom-in">
                  ✓ Successfully Subscribed!
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex justify-center items-center disabled:opacity-50"
                  >
                    {subscribing ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrackingResults;
