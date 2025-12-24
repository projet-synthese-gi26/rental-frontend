import type { Metadata } from 'next';
import './globals.css';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export const metadata: Metadata = {
  title: 'Easy Rental',
  description: 'Easy rental platform for clients, agencies, and organizations',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      {/* On enlève les classes de marges/paddings ici pour laisser la page gérer son propre espace */}
      <body className="min-h-screen bg-white dark:bg-[#0f1323] transition-colors duration-300">
        <OfflineIndicator />
        {/* On retire la Navbar générique et le main container car la Landing Page a sa propre structure full-width */}
        <main>{children}</main>
      </body>
    </html>
  );
}