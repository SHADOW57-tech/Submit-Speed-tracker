import { useState } from 'react';
import axios from 'axios';

const ShipmentForm = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    recipientName: '',
    weight: '',
    serviceType: 'Standard',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: In production, you'd send the Admin JWT token in headers
      const res = await axios.post('http://localhost:5000/api/shipments', formData);
      alert(`Shipment Created! Tracking Number: ${res.data.trackingNumber}`);
      setFormData({ origin: '', destination: '', recipientName: '', weight: '', serviceType: 'Standard' });
    } catch (err) {
      console.error(err);
      alert('Failed to create shipment');
    }
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-white">
      <h2 className="text-xl font-bold mb-6">Create New Shipment</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          className="bg-black border border-zinc-700 p-3 rounded-lg outline-none focus:border-red-500"
          placeholder="Origin (e.g. Lagos, Nigeria)"
          value={formData.origin}
          onChange={(e) => setFormData({...formData, origin: e.target.value})}
          required
        />
        <input 
          className="bg-black border border-zinc-700 p-3 rounded-lg outline-none focus:border-red-500"
          placeholder="Destination (e.g. London, UK)"
          value={formData.destination}
          onChange={(e) => setFormData({...formData, destination: e.target.value})}
          required
        />
        <input 
          className="bg-black border border-zinc-700 p-3 rounded-lg outline-none focus:border-red-500"
          placeholder="Recipient Name"
          value={formData.recipientName}
          onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
        />
        <select 
          className="bg-black border border-zinc-700 p-3 rounded-lg outline-none"
          value={formData.serviceType}
          onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
        >
          <option value="Standard">Standard Shipping</option>
          <option value="Express">Express Shipping</option>
          <option value="Freight">Freight</option>
        </select>
        <button type="submit" className="md:col-span-2 bg-red-600 hover:bg-red-500 py-3 rounded-lg font-bold transition-colors">
          Generate Tracking Number & Save
        </button>
      </form>
    </div>
  );
};

export default ShipmentForm;