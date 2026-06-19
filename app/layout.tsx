import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import ThemeProvider from '@/context/ThemeProvider';

export const metadata: Metadata = {
  title: 'Pokédex Explorer',
  description: 'Search Pokémon and view key stats instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en">
      <body>
      <ThemeProvider>
          <Header />
          <main>{children}</main>
      </ThemeProvider>
      </body>
  </html>
);
}