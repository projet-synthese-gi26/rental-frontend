import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Easy Rental - Portail Client',
  description: 'Réservez votre véhicule en un clic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      {/* On s'assure que le body n'a aucune marge par défaut */}
      <body className="min-h-screen bg-white dark:bg-[#0f1323] transition-colors duration-300 m-0 p-0">
        {/* On enlève le <main className="container..."> pour laisser la page gérer son espace */}
        <main>{children}</main>
      </body>
    </html>
  );
}