'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Extend window for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => Promise<void>;
  label?: string;
}

export default function GoogleLoginButton({
  onSuccess,
  label = 'Continue with Google',
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      try {
        await onSuccess(response.credential);
      } catch {
        // Error handled by parent
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    if (!clientId) return;

    // Check if script is already loaded
    if (window.google?.accounts) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount — it's a global resource
    };
  }, [clientId]);

  useEffect(() => {
    if (!scriptLoaded || !clientId || !window.google?.accounts) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render Google's own styled button inside our container
    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: buttonRef.current.offsetWidth,
      });
    }
  }, [scriptLoaded, clientId, handleCredentialResponse]);

  if (!clientId) return null;

  return (
    <div style={{ width: '100%' }}>
      {/* Google's rendered button */}
      <div
        ref={buttonRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'opacity 0.3s',
          minHeight: '44px',
        }}
      />

      {/* Fallback if script hasn't loaded */}
      {!scriptLoaded && (
        <button
          type="button"
          disabled
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#868e96',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Loading...
        </button>
      )}
    </div>
  );
}
