import React from 'react';
import { AlertTriangle, AlertCircle, FileWarning, Eye, KeyRound, Clock, ExternalLink } from 'lucide-react';

export default function IndicatorsList({ indicators = [] }) {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="indicators-card">
        <h3 className="section-title">
          <Eye size={18} className="text-cyan" />
          Detected Risk Indicators
        </h3>
        <p className="no-indicators-text">
          No prominent threat indicators or deception tactics were flagged in this message.
        </p>
      </div>
    );
  }

  // Pick suitable icon based on indicator title keywords
  const getIndicatorIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('urgency') || t.includes('time') || t.includes('deadline')) {
      return Clock;
    }
    if (t.includes('link') || t.includes('url') || t.includes('domain')) {
      return ExternalLink;
    }
    if (t.includes('credential') || t.includes('password') || t.includes('sensitive') || t.includes('auth')) {
      return KeyRound;
    }
    if (t.includes('impersonat') || t.includes('authority') || t.includes('spoof')) {
      return AlertCircle;
    }
    return FileWarning;
  };

  return (
    <div className="indicators-card">
      <div className="section-header">
        <h3 className="section-title">
          <AlertTriangle size={18} className="text-amber" />
          Key Deception Indicators ({indicators.length})
        </h3>
        <span className="section-subtitle">Suspicious behaviors and psychological manipulation tactics</span>
      </div>

      <div className="indicators-grid">
        {indicators.map((indicator, index) => {
          const Icon = getIndicatorIcon(indicator.title);
          return (
            <div key={index} className="indicator-item-card">
              <div className="indicator-icon-wrapper">
                <Icon size={18} className="indicator-icon" />
              </div>
              <div className="indicator-content">
                <h4 className="indicator-title">{indicator.title}</h4>
                <p className="indicator-explanation">{indicator.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
