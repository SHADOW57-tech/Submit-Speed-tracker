import React, { useState, useEffect } from 'react';
import { X, Globe, User, Truck, Save, Plus, Hash, Calendar, Weight, Info } from 'lucide-react';
import { API } from '@/services/api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateShipmentModal = ({ isOpen, onClose, onCreated }: Props) => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    status: 'Pending',
    origin: '',
    destination: '',
    currentLocation: '',
    recipientName: '',
    weight: '',
    serviceType: 'Standard',
    estimatedDelivery: ''
  });

  // Generate initial tracking ID when opened
  useEffect(() => {
    if (isOpen) generateNewTracking();
  }, [isOpen]);

  const generateNewTracking = () => {
    const newId = `UA${Math.floor(100000000 + Math.random() * 900000000)}ZA`;
    setFormData(prev => ({ ...prev, trackingNumber: newId }));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Admin authentication required. Please log in again.');
      return;
    }

    try {
      await API.post('/shipments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCreated();
      onClose();
    } catch (err: any) {
      console.error("Submission Error:", err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || "Error initializing shipment record.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden border-2 border-border animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b-2 border-border bg-muted/20">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase text-foreground">
              <PlusSquare className="text-primary" size={18} /> Create New Shipment
            </h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
              Add the shipment basics to the global intelligence network.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Top Banner */}
          <div className="p-4 bg-primary/5 border-2 border-primary/10 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Info size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-foreground">Create a shipment record</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Fill the operational details now, then add timeline updates so customers can follow the shipment publicly.
              </p>
            </div>
          </div>

          {/* Tracking Number Section */}
          <div className="space-y-2">
            <label className="label-caps">Tracking Number</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  readOnly
                  value={formData.trackingNumber}
                  className="input-field pl-10 bg-muted/30 font-mono text-xs font-bold tracking-widest border-dashed"
                />
              </div>
              <button 
                type="button"
                onClick={generateNewTracking}
                className="px-5 py-2 border-2 border-border rounded-xl text-[10px] font-black hover:bg-muted transition-all uppercase tracking-widest active:scale-95"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status & Estimated Date */}
            <div className="space-y-2">
              <label className="label-caps">Status</label>
              <select 
                className="input-field font-bold text-xs"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option>Pending</option>
                <option>In Transit</option>
                <option>Delivered</option>
                <option>On Hold</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Estimated Delivery</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  type="date"
                  className="input-field text-xs uppercase"
                  onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                />
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="space-y-2">
              <label className="label-caps">Origin</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  placeholder="Kyiv, Ukraine"
                  className="input-field pl-10"
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Destination</label>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  placeholder="Berlin, Germany"
                  className="input-field pl-10"
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div className="space-y-2">
            <label className="label-caps">Current Location</label>
            <input 
              placeholder="Latest checkpoint (Leave blank for origin)"
              className="input-field"
              onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1 space-y-2">
              <label className="label-caps">Recipient Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  className="input-field pl-10"
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Weight</label>
              <div className="relative">
                <Weight className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  placeholder="2.4 kg"
                  className="input-field"
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Service Type</label>
              <select 
                className="input-field font-bold text-xs"
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
              >
                <option>Standard</option>
                <option>Express</option>
                <option>Priority</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 justify-end pt-6 border-t-2 border-border mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all border-2 border-border"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save size={16} /> Create shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlusSquare = ({ size, className }: { size: number, className?: string }) => (
  <div className={`p-1.5 bg-primary/10 rounded-lg ${className}`}>
    <Plus size={size} strokeWidth={3} />
  </div>
);

export default CreateShipmentModal;