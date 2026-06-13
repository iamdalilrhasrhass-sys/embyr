'use client';

import { useState } from 'react';

const TYPES = [
  { value: 'bug', label: 'Bug' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'technical', label: 'Technical issue' },
  { value: 'other', label: 'Other' },
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!type || !message.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          userEmail: email.trim() || undefined,
          pageUrl: window.location.href,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setTimeout(() => { setIsOpen(false); setStatus('idle'); setType(''); setMessage(''); setEmail(''); }, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center transition-all shadow-lg"
        aria-label="Feedback"
      >
        {isOpen ? '✕' : '?'}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-[#0a0a1a] border border-white/[0.08] rounded-2xl p-5 shadow-2xl">
          <h3 className="font-bold text-white mb-1">Send Feedback</h3>
          <p className="text-white/40 text-xs mb-4">Help us improve Embir</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  type === t.value
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-white/5 border border-white/[0.06] rounded-lg p-3 text-sm text-white/80 placeholder:text-white/20 resize-none h-24 mb-3 focus:outline-none focus:border-white/20"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full bg-white/5 border border-white/[0.06] rounded-lg p-2.5 text-sm text-white/80 placeholder:text-white/20 mb-4 focus:outline-none focus:border-white/20"
          />

          <button
            onClick={handleSubmit}
            disabled={!type || !message.trim() || status === 'sending'}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-30 bg-white text-black hover:bg-white/90"
          >
            {status === 'idle' && 'Send Feedback'}
            {status === 'sending' && 'Sending...'}
            {status === 'sent' && '✅ Sent — Thank you!'}
            {status === 'error' && 'Error — Try again'}
          </button>
        </div>
      )}
    </>
  );
}
