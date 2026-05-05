import type {Metadata} from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: 'Retro AI Arcade',
  description: 'A retro arcade featuring classic mini-games and an AI assistant.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-arcade bg-[#1e1e1e] text-[#4af626]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
