import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, IBM_Plex_Sans_Arabic, Amiri, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ar',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-ar-read',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Bayan | Digital Islamic Library & Peer-Review Portal',
  description: 'Bayan (بيان) is a digital platform preserving, protecting, and promoting authentic Islamic heritage through knowledge, education, and technology.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} ${ibmPlexSansArabic.variable} ${amiri.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="bg-paper text-char font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
