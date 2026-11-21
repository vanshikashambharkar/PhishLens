import React from 'react';
import { ArrowUp, FileText, CheckCircle2, Zap } from 'lucide-react';
import RiskMeter from './RiskMeter';
import IndicatorsList from './IndicatorsList';
import RecommendationsList from './RecommendationsList';
import Disclaimer from './Disclaimer';

export default function ResultsSection({ result, onAnalyzeAnother }) {
  if (!result) return null;

  return (
    <section className="results-container" id="analysis-results">
      <div className="results-header-bar">
        <div className="results-title-group">
          {result.isFallback ? (
            <span className="results-badge results-badge-fallback">
              <Zap size={13} className="text-amber" /> Rule-based Fallback Analysis
            </span>
          ) : (
            <span className="results-badge">
              <CheckCircle2 size={13} className="text-teal" /> AI Analysis Complete
            </span>
          )}
          <h2 className="results-main-title">Threat Assessment Report</h2>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onAnalyzeAnother}
        >
          <ArrowUp size={14} />
          <span>Analyze Another Message</span>
        </button>
      </div>

      {/* Top Row: Risk Meter Gauge & Classification */}
      <RiskMeter
        riskScore={result.riskScore}
        riskLevel={result.riskLevel}
        category={result.category}
      />

      {/* Summary Box */}
      <div className="summary-card">
        <div className="summary-header">
          <FileText size={18} className="text-cyan" />
          <h3 className="summary-title">Executive Summary</h3>
        </div>
        <p className="summary-text">{result.summary}</p>
      </div>

      {/* Indicators and Recommendations */}
      <div className="analysis-breakdown-grid">
        <IndicatorsList indicators={result.indicators} />
        <RecommendationsList recommendations={result.recommendations} />
      </div>

      {/* Educational Disclaimer */}
      <Disclaimer />
    </section>
  );
}
