import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Ship,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [tracking, setTracking] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track/${tracking}`);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* --- SECTION 1: CINEMATIC SPLIT HERO --- */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b border-border/50">
        {/* Background Video with Dynamic Tint */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover"
          >
            <source src="/videos/hero_bg.mp4" type="video/mp4" />
          </video>
          {/* FIX: We use a dynamic overlay that is slightly lighter in Light Mode 
             and much deeper in Dark Mode using standard Tailwind alpha colors.
          */}
          <div className="absolute inset-0 bg-background/70 dark:bg-black/85 backdrop-blur-[2px] transition-colors duration-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Global Network Active
              </span>
            </div>

            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] text-foreground mb-6">
              REDEFINING <br />
              <span className="text-primary italic">LOGISTICS</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg mb-8 font-medium leading-relaxed">
              Experience the future of shipment intelligence. Real-time
              telemetry, predictive routing, and end-to-end transparency at the
              speed of thought.
            </p>

            <div className="flex items-center gap-6">
              <button className="btn-primary px-10 py-4 rounded-full text-base shadow-xl shadow-primary/20">
                Get Started
              </button>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted"
                  />
                ))}
                <div className="pl-6 text-sm font-bold text-muted-foreground">
                  +2.4k Active Users
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Animated Logistics Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: [1, 1.03, 1],
            }}
            transition={{
              opacity: { duration: 0.8 },
              x: { duration: 0.8 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="card-glass relative z-10 w-full max-w-md aspect-square overflow-hidden flex items-center justify-center">
              <img
                src="/3d-tracking.png" 
                alt="Logistics Hub"
                className="w-full h-full object-contain p-8"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white/60 font-mono text-[10px] mb-1 uppercase tracking-tighter">
                  Node_ID: LOS-CENTRAL
                </p>
                <p className="text-white font-black text-lg tracking-tight">
                  TERMINAL 01
                </p>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 right-4 z-20 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-primary/20 shadow-xl"
            >
              <Ship className="text-primary mb-1" size={24} />
              <p className="text-xl font-black text-foreground">99.9%</p>
              <p className="label">Uptime</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-foreground">
          <ChevronDown />
        </div>
      </section>

      {/* --- SECTION 2: THE TRACKING COMMAND CENTER --- */}
      <section className="relative z-20 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Command Center
            </h2>
            <p className="text-muted-foreground font-medium">
              Enter your secure tracking identifier to initialize real-time
              telemetry.
            </p>
          </div>

          <motion.div whileHover={{ y: -5 }} className="relative group">
            {/* Glow effect that uses primary theme color */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-orange-600 rounded-[30px] blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-card border-2 border-border p-3 rounded-[28px] shadow-2xl flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative">
                <Globe
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-primary animate-spin-slow"
                  size={24}
                />
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="SCAN TRACKING ID (e.g. SS-770-PX)"
                  className="w-full bg-transparent pl-16 pr-6 py-6 text-xl font-mono uppercase tracking-widest outline-none 
                             text-foreground placeholder:text-muted-foreground/40
                             focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full md:w-auto btn-primary px-12 py-6 rounded-[22px] font-black text-lg flex items-center justify-center gap-3"
              >
                INITIALIZE <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Quick Features below input */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <QuickIcon icon={<ShieldCheck size={18} />} label="Secure" />
            <QuickIcon icon={<Zap size={18} />} label="Instant" />
            <QuickIcon icon={<Globe size={18} />} label="Global" />
            <QuickIcon icon={<Ship size={18} />} label="Freight" />
          </div>
        </div>
      </section>
    </div>
  );
};

const QuickIcon = ({ icon, label }: any) => (
  <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default">
    {icon} <span className="label">{label}</span>
  </div>
);

export default Home;