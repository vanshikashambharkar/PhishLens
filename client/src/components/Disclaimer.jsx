import React from 'react';
import { Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="disclaimer-banner">
      <div className="disclaimer-icon-col">
        <Info size={16} className="disclaimer-icon" />
      </div>
      <div className="disclaimer-text">
        <strong>Security Disclaimer:</strong> PhishLens AI evaluates text semantics, linguistic patterns, and social engineering indicators using Google Gemini AI. This evaluation is an educational aid and does not constitute a technical network scan, domain registry check, or guarantee of safety. Always practice independent verification when handling sensitive communications.
      </div>
    </div>
  );
}
