import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import ThemeProvider from '@/context/ThemeProvider';
import ReduxProvider from '@/components/ReduxProvider';

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
        <ReduxProvider>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
          </ThemeProvider>
        </ReduxProvider>
      </body>
  </html>
);
}