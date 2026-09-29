import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../../types/onboarding';
import { aiService } from '../../services/aiService';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-0',
          sender: 'assistant',
          text:
            `Hello Sarah! 👋 I am your **Enterprise AI Onboarding & Skills Assistant**.\n\n` +
            `I'm here to guide you through your pre-boarding journey, setup logistics, benefit packages, and skills intelligence telemetry. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'What are my Day-1 tasks?',
            'Explain Health & 401(k) Benefits',
            'Who is my Reporting Manager?',
            'How does ML Skill Analysis work?'
          ]
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.chat(prompt, messages);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Chat error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue retrieving that information. Please ask again or reach out to HR Operations.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history reset. How else can I assist with your onboarding, Sarah?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What are my Day-1 tasks?',
          'Explain Health & 401(k) Benefits',
          'Who is my Reporting Manager?',
          'Take a Skill Assessment'
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Onboarding Assistant"
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.6), 0 0 20px rgba(124, 58, 237, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isOpen ? (
            <X size={26} color="#ffffff" />
          ) : (
            <>
              <Bot size={28} color="#ffffff" />
              {/* Pulsing AI Activity Ring */}
              <span
                className="pulse-live-indicator"
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #05070c'
                }}
              />
            </>
          )}
        </button>
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: 'calc(100vw - 32px)',
            maxWidth: '430px',
            height: '580px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.98) 0%, rgba(9, 13, 24, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.2)',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(59, 130, 246, 0.5)'
                }}
              >
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Onboardly AI</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      fontWeight: 700
                    }}
                  >
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  24/7 Onboarding & Skills Assistant
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div
            style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      maxWidth: '88%',
                      flexDirection: isUser ? 'row-reverse' : 'row'
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        <Sparkles size={12} color="#60a5fa" />
                      </div>
                    )}

                    <div
                      style={{
                        padding: '0.8rem 1rem',
                        borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isUser
                          ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                          : 'rgba(20, 28, 50, 0.85)',
                        color: isUser ? '#ffffff' : '#e2e8f0',
                        fontSize: '0.825rem',
                        lineHeight: 1.55,
                        border: isUser ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isUser
                          ? '0 4px 14px rgba(37, 99, 235, 0.35)'
                          : '0 4px 14px rgba(0, 0, 0, 0.35)',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#64748b',
                      marginTop: '0.25rem',
                      padding: isUser ? '0 0.5rem 0 0' : '0 0 0 2rem'
                    }}
                  >
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginTop: '0.6rem',
                        paddingLeft: '2rem'
                      }}
                    >
                      {msg.suggestions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          style={{
                            fontSize: '0.725rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '9999px',
                            background: 'rgba(59, 130, 246, 0.12)',
                            color: '#93c5fd',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={12} color="#60a5fa" />
                </div>
                <div
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '14px',
                    background: 'rgba(20, 28, 50, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', animation: 'pulseLive 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', animation: 'pulseLive 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', animation: 'pulseLive 1s infinite 0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Category Prompt Strip */}
          <div
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(7, 11, 20, 0.7)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {[
              { label: '💰 Benefits', query: 'Show benefits & 401k' },
              { label: '💻 Dev Setup', query: 'What tools and laptop do I get?' },
              { label: '👤 Manager', query: 'Who is my manager?' },
              { label: '🎯 Skill Tests', query: 'How to take domain skill assessment?' }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(11, 16, 28, 0.95)',
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about onboarding, policies, or skills..."
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                fontSize: '0.825rem',
                borderRadius: '10px',
                background: 'rgba(5, 8, 16, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
