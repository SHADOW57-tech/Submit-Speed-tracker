import { useState } from 'react';
import { API } from '@/services/api';

interface Props {
  shipmentId: string;
  onUpdate: () => void;
}

const EventManager = ({ shipmentId, onUpdate }: Props) => {
  const [event, setEvent] = useState({
    status: 'In Transit',
    location: '',
    note: ''
  });

  const handleAddEvent = async () => {
    try {
      await API.post(`/events/${shipmentId}`, event);
      alert('Timeline Updated!');
      onUpdate(); // Refresh the list
    } catch (err) {
      alert('Error updating timeline. Ensure you are logged in as admin.');
    }
  };

  return (
    <div className="mt-4 p-4 bg-zinc-800 rounded-xl space-y-3">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Add Status Update</h3>
      <select 
        className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
        onChange={(e) => setEvent({...event, status: e.target.value})}
      >
        <option value="In Transit">In Transit</option>
        <option value="Arrived at Hub">Arrived at Hub</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="On Hold">On Hold</option>
      </select>
      <input 
        className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
        placeholder="Current Location (City, Country)"
        onChange={(e) => setEvent({...event, location: e.target.value})}
      />
      <button 
        onClick={handleAddEvent}
        className="w-full bg-white text-black py-2 rounded font-bold hover:bg-zinc-200"
      >
        Post Update
      </button>
    </div>
  );
};

export default EventManager;