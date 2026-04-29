import type {
  PageSection,
  HeroContent,
  TextContent,
  CTAContent,
  CardsContent,
  FAQContent,
  DepoimentosContent,
  CapitulosContent,
  AutoresContent,
  FerramentasContent,
  FormContent,
} from '@/types/cms'
import { buildSectionStyle, hasStyle } from '@/lib/cms/build-section-style'
import { HeroSection } from '@/components/sections/HeroSection'
import { TextSection } from '@/components/sections/TextSection'
import { CTASection } from '@/components/sections/CTASection'
import { CardsSection } from '@/components/sections/CardsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { DepoimentosSection } from '@/components/sections/DepoimentosSection'
import { CapitulosSection } from '@/components/sections/CapitulosSection'
import { AutoresSection } from '@/components/sections/AutoresSection'
import { FerramentasSection } from '@/components/sections/FerramentasSection'
import { FormSection } from '@/components/sections/FormSection'

interface Props {
  section: PageSection
}

export function SectionRenderer({ section }: Props) {
  const hasBg = !!(section.style?.bgColor || section.style?.gradient)
  const inner = renderInner(section, hasBg)

  if (!hasStyle(section.style)) return inner

  return (
    <div
      style={buildSectionStyle(section.style)}
      data-section-type={section.type}
    >
      {inner}
    </div>
  )
}

function renderInner(section: PageSection, hasBg = false) {
  switch (section.type) {
    case 'hero':
      return <HeroSection content={section.content as HeroContent} hasBg={hasBg} />
    case 'text':
      return <TextSection content={section.content as TextContent} hasBg={hasBg} />
    case 'cta':
      return <CTASection content={section.content as CTAContent} hasBg={hasBg} />
    case 'cards':
      return <CardsSection content={section.content as CardsContent} hasBg={hasBg} />
    case 'faq':
      return <FAQSection content={section.content as FAQContent} />
    case 'depoimentos':
      return <DepoimentosSection content={section.content as DepoimentosContent} />
    case 'capitulos':
      return <CapitulosSection content={section.content as CapitulosContent} />
    case 'autores':
      return <AutoresSection content={section.content as AutoresContent} />
    case 'ferramentas':
      return <FerramentasSection content={section.content as FerramentasContent} />
    case 'form':
      return <FormSection content={section.content as FormContent} />
    default:
      return null
  }
}
