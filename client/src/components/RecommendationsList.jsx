import React from 'react';
import { CheckSquare, Shield, Check } from 'lucide-react';

export default function RecommendationsList({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-card">
      <div className="section-header">
        <h3 className="section-title">
          <Shield size={18} className="text-teal" />
          Recommended Actions & Defenses
        </h3>
        <span className="section-subtitle">Follow these practical steps to safeguard yourself or your organization</span>
      </div>

      <ul className="recommendations-list">
        {recommendations.map((rec, index) => (
          <li key={index} className="recommendation-item">
            <div className="checklist-bullet">
              <Check size={14} className="checklist-check-icon" />
            </div>
            <span className="recommendation-text">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
