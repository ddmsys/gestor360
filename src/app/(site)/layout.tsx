import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { DesignStyles } from '@/components/DesignStyles'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesignStyles />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
