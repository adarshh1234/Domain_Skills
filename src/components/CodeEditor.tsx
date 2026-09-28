import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Code2, Terminal } from 'lucide-react';

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

      // Restore cursor position
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={14} color="#60a5fa" />
          <span style={{ fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            {language}
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ fontSize: '0.75rem' }}>{lines.length} lines</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onReset && !readOnly && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', height: '28px' }}
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
            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', height: '28px' }}
            title="Copy code to clipboard"
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
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
