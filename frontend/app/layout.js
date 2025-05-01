import './globals.css';
import { Poppins } from 'next/font/google';

// Configuración de la fuente Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`h-full ${poppins.variable}`}>
      <head>
        <title>Hotel Lindo Sueño</title>
        <meta name="description" content="Sistema de gestión para Hotel Lindo Sueño" />
      </head>
      <body className="h-full overflow-hidden font-poppins">
        {children}
      </body>
    </html>
  );
}