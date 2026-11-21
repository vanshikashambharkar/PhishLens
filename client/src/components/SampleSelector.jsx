import React from 'react';
import { Building2, Package, Briefcase, UserX, CheckCircle2, Sparkles } from 'lucide-react';
import { SAMPLES } from '../data/samples';

const ICON_MAP = {
  Building2,
  Package,
  Briefcase,
  UserX,
  CheckCircle2
};

export default function SampleSelector({ onSelectSample, disabled }) {
  return (
    <div className="sample-selector-container">
      <div className="sample-header-row">
        <span className="sample-label">
          <Sparkles size={14} className="text-cyan inline-icon" />
          Test with a real-world scenario:
        </span>
      </div>
      <div className="sample-buttons-grid">
        {SAMPLES.map((sample) => {
          const IconComponent = ICON_MAP[sample.icon] || Sparkles;
          const isSafe = sample.id === 'legitimate-msg';

          return (
            <button
              key={sample.id}
              type="button"
              className={`sample-chip ${isSafe ? 'sample-chip-safe' : 'sample-chip-threat'}`}
              onClick={() => onSelectSample(sample.text)}
              disabled={disabled}
              title={`Load ${sample.title} (${sample.category})`}
            >
              <IconComponent size={15} className="sample-icon" />
              <span className="sample-chip-title">{sample.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
