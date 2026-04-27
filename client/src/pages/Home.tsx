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
      <section className="relative min-h-screen lg:h-[90vh] flex items-center overflow-hidden border-b border-border/50 py-20 lg:py-0">
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
          <div className="absolute inset-0 bg-background/70 dark:bg-black/85 backdrop-blur-[2px] transition-colors duration-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
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

            {/* Responsive Heading: smaller on mobile, massive on desktop */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] lg:leading-[0.85] text-foreground mb-6">
              REDEFINING <br />
              <span className="text-primary italic">LOGISTICS</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 font-medium leading-relaxed">
              Experience the future of shipment intelligence. Real-time
              telemetry, predictive routing, and end-to-end transparency at the
              speed of thought.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <button className="w-full sm:w-auto btn-primary px-10 py-4 rounded-full text-base shadow-xl shadow-primary/20">
                Get Started
              </button>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background bg-muted"
                    />
                  ))}
                </div>
                <div className="text-sm font-bold text-muted-foreground">
                  +2.4k Active Users
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Animated Logistics Image (Hidden on mobile/tablet to keep focus on Tracking) */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-white/60 font-mono text-[10px] mb-1 uppercase tracking-tighter">
                  Node_ID: LOS-CENTRAL
                </p>
                <p className="text-white font-black text-lg tracking-tight">
                  TERMINAL 01
                </p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 right-4 z-20 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-primary/20 shadow-xl"
            >
              <Ship className="text-primary mb-1" size={24} />
              <p className="text-xl font-black text-foreground">99.9%</p>
              <p className="text-[10px] uppercase font-bold opacity-50">Uptime</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-foreground">
          <ChevronDown />
        </div>
      </section>

      {/* --- SECTION 2: THE TRACKING COMMAND CENTER --- */}
      <section className="relative z-20 py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Command Center
            </h2>
            <p className="text-muted-foreground font-medium px-4">
              Enter your secure tracking identifier to initialize real-time
              telemetry.
            </p>
          </div>

          <motion.div whileHover={{ y: -5 }} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-[30px] blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-card border-2 border-border p-2 md:p-3 rounded-[28px] shadow-2xl flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative">
                <Globe
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-primary animate-spin-slow hidden sm:block"
                  size={24}
                />
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="SCAN TRACKING ID"
                  className="w-full bg-transparent pl-6 sm:pl-16 pr-6 py-5 md:py-6 text-lg md:text-xl font-mono uppercase tracking-widest outline-none 
                             text-foreground placeholder:text-muted-foreground/40
                             focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full md:w-auto btn-primary px-8 lg:px-12 py-5 md:py-6 rounded-[22px] font-black text-base md:text-lg flex items-center justify-center gap-3"
              >
                INITIALIZE <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Quick Features: 2 columns on mobile, 4 on desktop */}
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
  <div className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default">
    {icon} <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);

export default Home;