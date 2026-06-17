'use client';

import { useState } from 'react';

export default function InvitePage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://embir.xyz';
  const shareText = 'I joined EMBIR — a free dating app with no premium tier, no bots, and real profiles. No catch. Join me:';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
          Invite Friends to EMBIR
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem', lineHeight: 1.6 }}>
          The best dating app is nothing without the right people. 
          Share EMBIR with someone who deserves better than paywalled apps.
        </p>

        <div style={{
          background: '#14141f',
          border: '1px solid #2a2a3a',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#aaa' }}>
            Share this link:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input readOnly value={shareUrl}
              style={{
                flex: 1, background: '#0a0a0f', border: '1px solid #2a2a3a',
                borderRadius: '8px', padding: '0.75rem 1rem', color: '#e0e0e0', fontSize: '0.9rem',
              }}
            />
            <button onClick={copyLink}
              style={{
                background: copied ? '#22c55e' : '#8B5CF6', border: 'none',
                borderRadius: '8px', padding: '0.75rem 1.25rem', color: '#fff',
                fontWeight: 600, cursor: 'pointer',
              }}
            >{copied ? 'Copied!' : 'Copy'}</button>
          </div>
        </div>

        <div style={{
          background: '#14141f', border: '1px solid #2a2a3a',
          borderRadius: '12px', padding: '1.5rem',
        }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
            Share on social:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: '#1DA1F2', color: '#fff', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 600, textAlign: 'center' }}
            >Share on Twitter / X</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: '#1877F2', color: '#fff', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 600, textAlign: 'center' }}
            >Share on Facebook</a>
          </div>
        </div>

        <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
          EMBIR is 100% free. No premium tier. No bots. Just real people.
        </p>
      </div>
    </main>
  );
}
