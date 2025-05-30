import GoogleAnalytics from '@/components/google-analytics';
import { LanguageProvider } from '@/contexts/language-context';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mathaba',
  description: 'Mathaba Research Centers',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} main-body`}>
        <GoogleAnalytics />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
