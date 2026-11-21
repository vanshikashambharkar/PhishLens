import React from 'react';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo-icon-wrapper">
          <ShieldAlert className="logo-icon text-cyan" size={26} />
        </div>
        <div className="brand-text">
          <h1 className="brand-name">
            Phish<span className="gradient-text">Lens</span> AI
          </h1>
          <p className="brand-tagline">See through the deception.</p>
        </div>
      </div>

      <div className="system-status-pill">
        <span className="status-indicator-dot"></span>
        <Activity size={14} className="status-pulse-icon" />
        <span className="status-label">Threat Engine Active</span>
      </div>
    </header>
  );
}
