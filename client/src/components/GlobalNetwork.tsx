import React from 'react';
import './GlobalNetwork.css';

const GlobalNetwork: React.FC = () => {
  return (
    <div className="network-container">
      <div className="grid-overlay"></div>
      <div className="globe">
        {/* Animated Arcs */}
        <svg className="arcs" viewBox="0 0 200 200">
          <path d="M 50,100 Q 100,20 150,100" className="path-anim" />
          <path d="M 30,80 Q 100,10 170,80" className="path-anim delay" />
        </svg>
        {/* Pulsing Nodes */}
        <div className="node pos-1"></div>
        <div className="node pos-2"></div>
      </div>
    </div>
  );
};

export default GlobalNetwork;