import React from 'react';
import { ShieldCheck, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

export default function InputSection({
  text,
  onChange,
  onClear,
  onAnalyze,
  isLoading
}) {
  const MAX_CHARS = 50000;
  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = text.trim().length === 0;

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!isEmpty && !isLoading && !isOverLimit) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="input-card">
      <div className="input-card-header">
        <label htmlFor="message-input" className="input-label">
          Suspicious Message / Email / SMS Text
        </label>
        <span className={`char-counter ${isOverLimit ? 'char-over-limit' : ''}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
        </span>
      </div>

      <div className="textarea-wrapper">
        <textarea
          id="message-input"
          className="message-textarea"
          rows={7}
          placeholder="Paste an email, SMS message, message body, or link text here to inspect for phishing, impersonation, and social engineering indicators..."
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>

      <div className="input-card-footer">
        <div className="input-hint">
          <span className="keyboard-shortcut">Ctrl + Enter</span> to analyze quickly
        </div>

        <div className="action-button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClear}
            disabled={isEmpty || isLoading}
          >
            <RotateCcw size={16} />
            <span>Clear</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAnalyze}
            disabled={isEmpty || isLoading || isOverLimit}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner-icon" />
                <span>Scanning Patterns...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Analyze Threat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
