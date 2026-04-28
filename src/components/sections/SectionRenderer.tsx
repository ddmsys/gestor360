import type { PageSection } from '@/types/cms'

interface Props {
  section: PageSection
}

export function SectionRenderer({ section }: Props) {
  switch (section.type) {
    case 'hero':
      return <div data-section="hero" data-id={section.id} />
    case 'text':
      return <div data-section="text" data-id={section.id} />
    case 'cta':
      return <div data-section="cta" data-id={section.id} />
    default:
      return null
  }
}
