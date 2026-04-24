import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: Props) => {
  return (
    <div className={`fixed top-6 right-6 flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-right duration-300 z-[100] ${
      type === 'success' ? 'bg-green-900/20 border-green-500 text-green-500' : 'bg-red-900/20 border-red-500 text-red-500'
    } backdrop-blur-md`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <p className="font-bold text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 hover:opacity-50"><X size={16} /></button>
    </div>
  );
};

export default Notification;