import React from 'react';

interface Event {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
}

const Timeline = ({ events }: { events: Event[] }) => {
  return (
    <div className="space-y-6 border-l-2 border-red-500 ml-4">
      {events.map((event, index) => (
        <div key={index} className="relative pl-8">
          <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-500/50"></div>
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <h4 className="text-white font-bold">{event.status}</h4>
            <p className="text-zinc-400 text-sm">{event.location}</p>
            <p className="text-zinc-500 text-xs mt-1">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;