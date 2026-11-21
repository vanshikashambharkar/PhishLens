import React, { useState, useRef } from 'react';
import { AlertOctagon, RefreshCw, Shield, Sparkles, Terminal } from 'lucide-react';
import Header from './components/Header';
import SampleSelector from './components/SampleSelector';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';

const API_URL = 'http://localhost:5000/api/analyze';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  const handleSelectSample = (sampleText) => {
    setInputText(sampleText);
    setError(null);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setError('Please paste or enter a message before running the threat analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: trimmed })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `Server returned error (${response.status})`);
      }

      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      console.error('Analysis request failed:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot reach PhishLens backend. Make sure the Node server is running on port 5000 (cd server && npm start).');
      } else {
        setError(err.message || 'An unexpected error occurred during threat analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Ambient Cyber Glow Backgrounds */}
      <div className="glow-sphere glow-sphere-cyan"></div>
      <div className="glow-sphere glow-sphere-violet"></div>

      <div className="app-container">
        <Header />

        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-badge">
              <Shield size={14} className="text-cyan" />
              <span>AI-Powered Cybersecurity Engine</span>
            </div>
            <h2 className="hero-title">
              Detect Social Engineering & Phishing in <span className="gradient-text">Real Time</span>
            </h2>
            <p className="hero-description">
              Paste suspicious emails, SMS lures, executive requests, or suspicious messages.
              PhishLens AI inspects deception markers, psychological pressure tactics, and dangerous patterns.
            </p>
          </section>

          {/* Sample Selector */}
          <SampleSelector
            onSelectSample={handleSelectSample}
            disabled={isLoading}
          />

          {/* Input Area */}
          <div ref={inputRef}>
            <InputSection
              text={inputText}
              onChange={setInputText}
              onClear={handleClear}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="error-banner">
              <div className="error-icon-wrapper">
                <AlertOctagon size={20} className="error-icon" />
              </div>
              <div className="error-content">
                <h4 className="error-title">Analysis Interrupted</h4>
                <p className="error-message">{error}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State / Skeleton */}
          {isLoading && (
            <div className="loading-card">
              <div className="radar-sweep-scanner">
                <div className="radar-sweep"></div>
                <Terminal size={32} className="radar-center-icon text-cyan" />
              </div>
              <div className="loading-text-group">
                <h3 className="loading-heading">Deconstructing Message Indicators...</h3>
                <p className="loading-subheading">
                  Checking urgency coercion, brand impersonation, deceptive URLs, and credential harvesting patterns.
                </p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <ResultsSection
              result={result}
              onAnalyzeAnother={handleAnalyzeAnother}
            />
          )}
        </main>

        <footer className="footer">
          <p className="footer-copyright">
            PhishLens AI &copy; 2026 &bull; Designed for rapid scam awareness & threat assessment
          </p>
        </footer>
      </div>
    </div>
  );
}
