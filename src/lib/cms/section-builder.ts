import type {
  AutorItem,
  AutoresContent,
  CardItem,
  CTAContent,
  CapitulosContent,
  CardsContent,
  DepoimentoItem,
  DepoimentosContent,
  FAQContent,
  FAQItem,
  FerramentasContent,
  FormContent,
  FormField,
  HeroContent,
  SectionContent,
  SectionType,
  TextContent,
} from '@/types/cms'

export const SECTION_TYPES: {
  type: SectionType
  label: string
  desc: string
  intent: string
}[] = [
  { type: 'hero', label: 'Hero', desc: 'Topo da pagina com titulo, imagem e chamadas.', intent: 'Primeira dobra' },
  { type: 'text', label: 'Texto editorial', desc: 'Bloco de conteudo com titulo, selo e corpo.', intent: 'Narrativa' },
  { type: 'cards', label: 'Cards', desc: 'Grid responsivo para beneficios, etapas ou recursos.', intent: 'Comparacao' },
  { type: 'ferramentas', label: 'Ferramentas', desc: 'Biblioteca ou lista filtrada por capitulo.', intent: 'Downloads' },
  { type: 'form', label: 'Formulario', desc: 'Captura de leads com campos configuraveis.', intent: 'Conversao' },
  { type: 'faq', label: 'FAQ', desc: 'Perguntas e respostas em formato escaneavel.', intent: 'Objecoes' },
  { type: 'cta', label: 'CTA', desc: 'Chamada de acao com botoes e imagem opcional.', intent: 'Acao' },
  { type: 'depoimentos', label: 'Depoimentos', desc: 'Prova social manual ou vinda do banco.', intent: 'Credibilidade' },
  { type: 'capitulos', label: 'Capitulos', desc: 'Mapa dos 10 capitulos do metodo.', intent: 'Conteudo do livro' },
  { type: 'autores', label: 'Autores', desc: 'Bio, foto e links dos autores.', intent: 'Autoridade' },
]

export const SECTION_TYPE_LABELS = SECTION_TYPES.reduce(
  (acc, item) => ({ ...acc, [item.type]: item.label }),
  {} as Record<SectionType, string>,
)

export const SECTION_TEMPLATES: Record<SectionType, SectionContent> = {
  hero: {
    title: 'Titulo principal aqui',
    subtitle: 'Subtitulo opcional para complementar a promessa da pagina.',
    cta_label: 'Texto do botao principal',
    cta_url: '/ferramentas',
    cta_secondary_label: 'Botao secundario',
    cta_secondary_url: '/sobre',
    variant: 'canvas',
    align: 'center',
    bg_image: '',
    show_360_animation: false,
  },
  text: {
    title: 'Titulo da secao',
    subtitle: 'Subtitulo opcional',
    body: 'Texto da secao. Use paragrafos curtos para facilitar a leitura.',
    badge: 'Label opcional',
    badge_color: 'blue',
    align: 'center',
    max_width: 'lg',
    bg: 'white',
  },
  cards: {
    title: 'Titulo da secao de cards',
    subtitle: 'Subtitulo opcional',
    badge: '',
    badge_color: 'blue',
    columns: 3,
    bg: 'white',
    card_style: 'shadow',
    cards: [
      { icon: '01', title: 'Card 1', description: 'Descricao do primeiro card' },
      { icon: '02', title: 'Card 2', description: 'Descricao do segundo card' },
      { icon: '03', title: 'Card 3', description: 'Descricao do terceiro card' },
    ],
  },
  ferramentas: {
    title: 'Ferramentas praticas',
    subtitle: 'Baixe e use no seu negocio.',
    layout: 'grid',
    mostrar_todos: true,
    capitulo_inicial: undefined,
    mostrar_cta_codigo: false,
    cta_codigo_titulo: 'Acesso completo',
    cta_codigo_descricao: 'Insira o codigo do livro para desbloquear todas as ferramentas.',
  },
  form: {
    title: 'Acesse as ferramentas',
    subtitle: 'Cadastre-se gratuitamente.',
    bg: 'white',
    layout: 'centered',
    submit_label: 'Quero acesso gratuito',
    success_title: 'Cadastro confirmado',
    success_message: 'Seu acesso foi liberado.',
    redirect_url: '',
    form_id: '',
    fields: [
      { field_key: 'nome', label: 'Nome completo', type: 'text', required: true, placeholder: 'Seu nome' },
      { field_key: 'email', label: 'E-mail', type: 'email', required: true, placeholder: 'seu@email.com' },
      { field_key: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false, placeholder: '(11) 99999-9999' },
    ],
  },
  faq: {
    title: 'Perguntas frequentes',
    subtitle: '',
    badge: 'FAQ',
    badge_color: 'blue',
    bg: 'canvas',
    layout: 'single',
    items: [
      { question: 'Qual e a primeira pergunta?', answer: 'Resposta da primeira pergunta.' },
      { question: 'Qual e a segunda pergunta?', answer: 'Resposta da segunda pergunta.' },
    ],
  },
  cta: {
    title: 'Comece sua transformacao agora',
    subtitle: 'Chamada curta para reforcar a acao.',
    body: '',
    cta_text: 'Acessar ferramentas',
    cta_href: '/ferramentas',
    cta_secondary_label: '',
    cta_secondary_url: '',
    background: 'blue',
    align: 'center',
    image_url: '',
    image_alt: '',
    image_side: 'right',
  },
  depoimentos: {
    title: 'O que dizem os gestores',
    subtitle: 'Historias reais de transformacao.',
    badge: 'Depoimentos',
    badge_color: 'gold',
    source: 'manual',
    layout: 'grid',
    columns: 3,
    bg: 'canvas',
    limit: 6,
    items: [
      {
        nome: 'Nome do gestor',
        cargo: 'Cargo',
        empresa: 'Empresa',
        texto: 'Depoimento curto sobre o resultado percebido.',
        nota: 5,
      },
    ],
  },
  capitulos: {
    title: 'Os 10 capitulos do metodo',
    subtitle: 'Uma jornada completa para liderar com mais clareza.',
    badge: 'Livro',
    bg: 'white',
    layout: 'grid',
    link_para_ferramenta: true,
  },
  autores: {
    title: 'Conheca os autores',
    subtitle: 'Especialistas por tras do Gestor360.',
    bg: 'white',
    layout: 'side-by-side',
    autores: [
      {
        nome: 'Nome do autor',
        cargo: 'Cargo ou autoridade',
        bio: 'Bio curta do autor.',
        foto_url: '/autores/autor.jpg',
        instagram_url: '',
        linkedin_url: '',
        site_url: '',
      },
    ],
  },
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function optionalStr(formData: FormData, key: string) {
  const value = str(formData, key)
  return value || undefined
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === 'on'
}

function int(formData: FormData, key: string) {
  const value = Number.parseInt(str(formData, key), 10)
  return Number.isFinite(value) ? value : undefined
}

function enumValue<T extends string | undefined>(
  formData: FormData,
  key: string,
  fallback: NonNullable<T>,
): NonNullable<T> {
  return (str(formData, key) || fallback) as NonNullable<T>
}

function prune<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ''),
  ) as T
}

function collectCards(formData: FormData): CardItem[] {
  return Array.from({ length: 8 }, (_, index) => {
    const title = str(formData, `card_${index}_title`)
    const description = str(formData, `card_${index}_description`)
    if (!title && !description) return null
    return prune({
      icon: optionalStr(formData, `card_${index}_icon`),
      title,
      description,
      link_url: optionalStr(formData, `card_${index}_link_url`),
      link_label: optionalStr(formData, `card_${index}_link_label`),
      badge: optionalStr(formData, `card_${index}_badge`),
    })
  }).filter(Boolean) as CardItem[]
}

function collectFaqItems(formData: FormData): FAQItem[] {
  return Array.from({ length: 10 }, (_, index) => {
    const question = str(formData, `faq_${index}_question`)
    const answer = str(formData, `faq_${index}_answer`)
    if (!question && !answer) return null
    return prune({
      question,
      answer,
      open_by_default: bool(formData, `faq_${index}_open_by_default`) || undefined,
    })
  }).filter(Boolean) as FAQItem[]
}

function collectFormFields(formData: FormData): FormField[] {
  return Array.from({ length: 8 }, (_, index) => {
    const field_key = str(formData, `field_${index}_field_key`)
    const label = str(formData, `field_${index}_label`)
    if (!field_key && !label) return null
    const options = str(formData, `field_${index}_options`)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    return prune({
      field_key,
      label,
      type: enumValue<FormField['type']>(formData, `field_${index}_type`, 'text'),
      placeholder: optionalStr(formData, `field_${index}_placeholder`),
      required: bool(formData, `field_${index}_required`) || undefined,
      options: options.length > 0 ? options : undefined,
      mask: optionalStr(formData, `field_${index}_mask`) as FormField['mask'] | undefined,
    })
  }).filter(Boolean) as FormField[]
}

function collectDepoimentos(formData: FormData): DepoimentoItem[] {
  return Array.from({ length: 6 }, (_, index) => {
    const nome = str(formData, `depoimento_${index}_nome`)
    const texto = str(formData, `depoimento_${index}_texto`)
    if (!nome && !texto) return null
    return prune({
      nome,
      cargo: optionalStr(formData, `depoimento_${index}_cargo`),
      empresa: optionalStr(formData, `depoimento_${index}_empresa`),
      texto,
      foto_url: optionalStr(formData, `depoimento_${index}_foto_url`),
      nota: int(formData, `depoimento_${index}_nota`) as DepoimentoItem['nota'] | undefined,
    })
  }).filter(Boolean) as DepoimentoItem[]
}

function collectAutores(formData: FormData): AutorItem[] {
  return Array.from({ length: 4 }, (_, index) => {
    const nome = str(formData, `autor_${index}_nome`)
    const bio = str(formData, `autor_${index}_bio`)
    if (!nome && !bio) return null
    return prune({
      nome,
      cargo: str(formData, `autor_${index}_cargo`),
      bio,
      foto_url: str(formData, `autor_${index}_foto_url`),
      linkedin_url: optionalStr(formData, `autor_${index}_linkedin_url`),
      instagram_url: optionalStr(formData, `autor_${index}_instagram_url`),
      site_url: optionalStr(formData, `autor_${index}_site_url`),
    })
  }).filter(Boolean) as AutorItem[]
}

export function buildSectionContent(type: SectionType, formData: FormData): SectionContent {
  if (str(formData, 'content_json')) {
    return JSON.parse(str(formData, 'content_json')) as SectionContent
  }

  switch (type) {
    case 'hero':
      return prune<HeroContent>({
        title: str(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        cta_label: optionalStr(formData, 'cta_label'),
        cta_url: optionalStr(formData, 'cta_url'),
        cta_secondary_label: optionalStr(formData, 'cta_secondary_label'),
        cta_secondary_url: optionalStr(formData, 'cta_secondary_url'),
        variant: enumValue<HeroContent['variant']>(formData, 'variant', 'canvas'),
        bg_image: optionalStr(formData, 'bg_image'),
        show_360_animation: bool(formData, 'show_360_animation'),
        align: enumValue<HeroContent['align']>(formData, 'align', 'center'),
      })
    case 'text':
      return prune<TextContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        body: str(formData, 'body'),
        align: enumValue<TextContent['align']>(formData, 'align', 'center'),
        max_width: enumValue<TextContent['max_width']>(formData, 'max_width', 'lg'),
        bg: enumValue<TextContent['bg']>(formData, 'bg', 'white'),
        badge: optionalStr(formData, 'badge'),
        badge_color: enumValue<TextContent['badge_color']>(formData, 'badge_color', 'blue'),
      })
    case 'cards':
      return prune<CardsContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        badge: optionalStr(formData, 'badge'),
        badge_color: enumValue<CardsContent['badge_color']>(formData, 'badge_color', 'blue'),
        columns: int(formData, 'columns') as CardsContent['columns'],
        bg: enumValue<CardsContent['bg']>(formData, 'bg', 'white'),
        card_style: enumValue<CardsContent['card_style']>(formData, 'card_style', 'shadow'),
        cards: collectCards(formData),
      })
    case 'ferramentas':
      return prune<FerramentasContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        capitulo_inicial: int(formData, 'capitulo_inicial'),
        mostrar_todos: bool(formData, 'mostrar_todos'),
        layout: enumValue<FerramentasContent['layout']>(formData, 'layout', 'grid'),
        mostrar_cta_codigo: bool(formData, 'mostrar_cta_codigo'),
        cta_codigo_titulo: optionalStr(formData, 'cta_codigo_titulo'),
        cta_codigo_descricao: optionalStr(formData, 'cta_codigo_descricao'),
      })
    case 'form':
      return prune<FormContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        badge: optionalStr(formData, 'badge'),
        bg: enumValue<FormContent['bg']>(formData, 'bg', 'white'),
        layout: enumValue<FormContent['layout']>(formData, 'layout', 'centered'),
        submit_label: optionalStr(formData, 'submit_label'),
        success_title: optionalStr(formData, 'success_title'),
        success_message: optionalStr(formData, 'success_message'),
        redirect_url: optionalStr(formData, 'redirect_url'),
        form_id: optionalStr(formData, 'form_id'),
        fields: collectFormFields(formData),
      })
    case 'faq':
      return prune<FAQContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        badge: optionalStr(formData, 'badge'),
        badge_color: enumValue<FAQContent['badge_color']>(formData, 'badge_color', 'blue'),
        bg: enumValue<FAQContent['bg']>(formData, 'bg', 'canvas'),
        layout: enumValue<FAQContent['layout']>(formData, 'layout', 'single'),
        items: collectFaqItems(formData),
      })
    case 'cta':
      return prune<CTAContent>({
        title: str(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        body: optionalStr(formData, 'body'),
        cta_text: str(formData, 'cta_text'),
        cta_href: str(formData, 'cta_href'),
        cta_secondary_label: optionalStr(formData, 'cta_secondary_label'),
        cta_secondary_url: optionalStr(formData, 'cta_secondary_url'),
        background: enumValue<CTAContent['background']>(formData, 'background', 'blue'),
        align: enumValue<CTAContent['align']>(formData, 'align', 'center'),
        image_url: optionalStr(formData, 'image_url'),
        image_alt: optionalStr(formData, 'image_alt'),
        image_side: enumValue<CTAContent['image_side']>(formData, 'image_side', 'right'),
      })
    case 'depoimentos':
      return prune<DepoimentosContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        badge: optionalStr(formData, 'badge'),
        badge_color: enumValue<DepoimentosContent['badge_color']>(formData, 'badge_color', 'gold'),
        source: enumValue<DepoimentosContent['source']>(formData, 'source', 'manual'),
        layout: enumValue<DepoimentosContent['layout']>(formData, 'layout', 'grid'),
        columns: int(formData, 'columns') as DepoimentosContent['columns'],
        bg: enumValue<DepoimentosContent['bg']>(formData, 'bg', 'canvas'),
        limit: int(formData, 'limit'),
        items: collectDepoimentos(formData),
      })
    case 'capitulos':
      return prune<CapitulosContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        badge: optionalStr(formData, 'badge'),
        bg: enumValue<CapitulosContent['bg']>(formData, 'bg', 'white'),
        layout: enumValue<CapitulosContent['layout']>(formData, 'layout', 'grid'),
        link_para_ferramenta: bool(formData, 'link_para_ferramenta'),
      })
    case 'autores':
      return prune<AutoresContent>({
        title: optionalStr(formData, 'title'),
        subtitle: optionalStr(formData, 'subtitle'),
        bg: enumValue<AutoresContent['bg']>(formData, 'bg', 'white'),
        layout: enumValue<AutoresContent['layout']>(formData, 'layout', 'side-by-side'),
        autores: collectAutores(formData),
      })
  }
}
