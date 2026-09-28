import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Terminal } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  language?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onReset,
  language = 'javascript',
  readOnly = false,
  minHeight = '380px'
}) => {
  const [copied, setCopied] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updatedCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(updatedCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="code-editor-container">
      {/* Editor Header Bar */}
      <div className="code-editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}
          >
            <Terminal size={13} strokeWidth={2.4} />
          </div>
          <span style={{ fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
            {language}
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            {lines.length} lines
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onReset && !readOnly && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.725rem', height: '28px', borderRadius: '8px' }}
              title="Reset to starter code"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.725rem', height: '28px', borderRadius: '8px' }}
            title="Copy code to clipboard"
          >
            {copied ? <Check size={12} color="#34d399" strokeWidth={2.5} /> : <Copy size={12} />}
            <span style={{ color: copied ? '#34d399' : 'inherit' }}>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="code-editor-body" style={{ minHeight }}>
        <div className="line-numbers">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="code-textarea"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="// Type your code here..."
        />
      </div>
    </div>
  );
};
