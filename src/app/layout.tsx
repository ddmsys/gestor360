import type { Metadata } from 'next'
import {
  DM_Sans,
  Inter,
  Nunito,
  Open_Sans,
  Oswald,
  Montserrat,
  Playfair_Display,
} from 'next/font/google'
import { AuthErrorRedirect } from '@/components/AuthErrorRedirect'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Gestor360® — O Método que Transforma Quem Lidera',
    template: '%s | Gestor360®',
  },
  description:
    'O método que une razão e alma para transformar quem lidera — e, por isso, transforma a empresa. 31 ferramentas práticas para pequenos e médios empresários.',
  metadataBase: new URL('https://ogestor360.com'),
  openGraph: {
    siteName: 'Gestor360®',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${inter.variable} ${nunito.variable} ${openSans.variable} ${oswald.variable} ${montserrat.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/pwr2rya.css" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthErrorRedirect />
        {children}
      </body>
    </html>
  )
}
