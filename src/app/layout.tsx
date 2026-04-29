import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { AuthErrorRedirect } from '@/components/AuthErrorRedirect'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
      className={`${dmSans.variable} h-full antialiased`}
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
