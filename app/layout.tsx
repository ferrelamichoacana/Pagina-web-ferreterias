import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { LanguageProvider } from '@/lib/i18n/LanguageProvider'


const inter = Inter({ 
  subsets: ['latin'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  display: 'swap',
  adjustFontFallback: false
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Ferretería La Michoacana - Materiales de Construcción y Herramientas',
  description: 'Ferretería líder en México con sucursales en múltiples estados. Especialistas en materiales de construcción, herramientas y suministros industriales.',
  keywords: 'ferretería, materiales construcción, herramientas, México, Michoacán',
  authors: [{ name: 'David Padilla Ruiz - DINOS Tech', url: 'mailto:atencionaclientes@dinoraptor.tech' }],
  creator: 'DINOS Tech',
  publisher: 'Ferretería La Michoacana',
  robots: 'index, follow',
  openGraph: {
    title: 'Ferretería La Michoacana',
    description: 'Tu ferretería de confianza con la mejor calidad y servicio',
    type: 'website',
    locale: 'es_MX',
    alternateLocale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Meta tags de autoría según requerimientos */}
        <meta name="author" content="Desarrollador: David Padilla Ruiz - DINOS Tech (3333010376, atencionaclientes@dinoraptor.tech)" />
        <meta name="developer" content="David Padilla Ruiz" />
        <meta name="contact" content="3333010376" />
        <meta name="support-email" content="atencionaclientes@dinoraptor.tech" />
        <meta name="company" content="DINOS Tech" />
        
        {/* Favicon y iconos */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Preconnect para optimización */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html> 