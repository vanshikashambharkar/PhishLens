import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';

export default function RiskMeter({ riskScore = 0, riskLevel = 'Safe', category = 'Unknown' }) {
  // Normalize risk level
  const normalizedLevel = (riskLevel || 'Safe').toLowerCase();

  // Determine color scheme based on level and score
  const getLevelConfig = () => {
    switch (normalizedLevel) {
      case 'critical':
        return {
          label: 'CRITICAL THREAT',
          colorClass: 'risk-critical',
          strokeColor: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.4)',
          Icon: AlertOctagon,
          bgGradient: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)'
        };
      case 'high':
        return {
          label: 'HIGH RISK',
          colorClass: 'risk-high',
          strokeColor: '#f97316',
          glowColor: 'rgba(249, 115, 22, 0.4)',
          Icon: ShieldAlert,
          bgGradient: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.15) 0%, transparent 70%)'
        };
      case 'medium':
        return {
          label: 'SUSPICIOUS / MEDIUM',
          colorClass: 'risk-medium',
          strokeColor: '#f59e0b',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          Icon: AlertTriangle,
          bgGradient: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
        };
      case 'low':
        return {
          label: 'LOW RISK',
          colorClass: 'risk-low',
          strokeColor: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          Icon: ShieldCheck,
          bgGradient: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
        };
      case 'safe':
      default:
        return {
          label: 'LIKELY SAFE',
          colorClass: 'risk-safe',
          strokeColor: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          Icon: CheckCircle,
          bgGradient: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.Icon;

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, riskScore)) / 100) * circumference;

  return (
    <div className={`risk-meter-card ${config.colorClass}`} style={{ background: config.bgGradient }}>
      <div className="risk-gauge-container">
        <svg className="risk-gauge-svg" width="180" height="180" viewBox="0 0 180 180">
          <circle
            className="gauge-bg-circle"
            cx="90"
            cy="90"
            r={radius}
            strokeWidth="12"
          />
          <circle
            className="gauge-progress-circle"
            cx="90"
            cy="90"
            r={radius}
            strokeWidth="12"
            stroke={config.strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${config.glowColor})`
            }}
          />
        </svg>

        <div className="gauge-center-content">
          <span className="gauge-score-number">{riskScore}</span>
          <span className="gauge-score-denom">/ 100</span>
          <span className="gauge-score-label">Risk Index</span>
        </div>
      </div>

      <div className="risk-details">
        <div className="risk-badge-wrapper">
          <span className={`risk-badge ${config.colorClass}`}>
            <IconComponent size={16} className="risk-badge-icon" />
            {config.label}
          </span>
        </div>

        <div className="category-meta-box">
          <span className="meta-label">Threat Classification</span>
          <h3 className="category-title">{category || 'General Assessment'}</h3>
        </div>
      </div>
    </div>
  );
}
