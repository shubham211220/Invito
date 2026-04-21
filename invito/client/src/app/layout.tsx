import type { Metadata } from 'next';
import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Invito — Create Beautiful Digital Invitations',
  description:
    'Design stunning event invitations for weddings, birthdays, engagements, and more. Share via unique links and track RSVPs effortlessly.',
  keywords: ['invitations', 'events', 'wedding', 'birthday', 'RSVP', 'digital invitation'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#f1f3f5',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '0.9rem',
              },
              success: {
                iconTheme: { primary: '#40c057', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#e03131', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
