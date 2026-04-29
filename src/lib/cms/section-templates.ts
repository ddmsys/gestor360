import type { SectionType, SectionContent } from '@/types/cms'

export interface SectionTemplate {
  label: string
  content: Partial<SectionContent>
}

export interface SectionTypeDefinition {
  type: SectionType
  label: string
  icon: string
  desc: string
  variants: SectionTemplate[]
}

export const SECTION_TYPES: SectionTypeDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: '🎯',
    desc: 'Seção principal com título, subtítulo e botão de ação',
    variants: [
      {
        label: 'Dark com animação 360',
        content: {
          variant: 'dark',
          show_360_animation: true,
          align: 'center',
          title: 'O método que transforma quem lidera',
          subtitle: 'Para pequenos e médios empresários que querem liderar com consciência.',
          cta_label: 'Conhecer o método',
          cta_url: '/metodo',
        },
      },
      {
        label: 'Canvas claro',
        content: {
          variant: 'canvas',
          align: 'left',
          title: 'Acesse as 31 ferramentas do método',
          subtitle: 'Cadastre-se e receba os PDFs por e-mail.',
          cta_label: 'Quero as ferramentas',
          cta_url: '/ferramentas',
        },
      },
      {
        label: 'Azul da marca',
        content: {
          variant: 'blue',
          align: 'center',
          title: 'Gestor360®',
          subtitle: 'O método completo.',
        },
      },
    ],
  },
  {
    type: 'cards',
    label: 'Cards',
    icon: '🃏',
    desc: 'Grade de cards — benefícios, pilares, recursos',
    variants: [
      {
        label: '3 colunas canvas',
        content: {
          columns: 3,
          bg: 'canvas',
          card_style: 'shadow',
          title: 'Os 3 pilares do método',
          cards: [
            { icon: '⚙️', title: 'Técnica', description: 'As ferramentas de gestão que transformam processos.' },
            { icon: '🧠', title: 'Neurociência', description: 'Como sua mente interfere no negócio e nos resultados.' },
            { icon: '✨', title: 'Propósito', description: 'A dimensão que transforma gestores em líderes.' },
          ],
        },
      },
      {
        label: '2 colunas branco',
        content: {
          columns: 2,
          bg: 'white',
          card_style: 'bordered',
          title: 'Por que o Gestor360®?',
          cards: [
            { icon: '📚', title: '31 ferramentas práticas', description: 'Cada ferramenta aplicável no dia seguinte à leitura.' },
            { icon: '🎯', title: 'Método integrado', description: 'Técnica, neurociência e propósito em um só sistema.' },
          ],
        },
      },
      {
        label: '4 colunas flat',
        content: {
          columns: 4,
          bg: 'white',
          card_style: 'flat',
          cards: [
            { icon: '📊', title: 'Diagnóstico', description: 'Entenda onde está.' },
            { icon: '🗺️', title: 'Planejamento', description: 'Trace o caminho.' },
            { icon: '🚀', title: 'Execução', description: 'Aja com método.' },
            { icon: '🔄', title: 'Revisão', description: 'Aprenda e ajuste.' },
          ],
        },
      },
    ],
  },
  {
    type: 'text',
    label: 'Texto',
    icon: '📝',
    desc: 'Bloco de texto — sobre, contexto, explicações',
    variants: [
      {
        label: 'Centralizado canvas',
        content: {
          align: 'center',
          bg: 'canvas',
          badge: 'O Método',
          title: 'Gestão é técnica. Liderança é consciência.',
          body: 'O Gestor360® nasce da convicção de que o melhor líder é aquele que se conhece — e esse autoconhecimento, aliado às ferramentas certas, transforma qualquer negócio.',
        },
      },
      {
        label: 'À esquerda branco',
        content: {
          align: 'left',
          bg: 'white',
          title: 'Sobre o livro',
          body: 'Um guia prático para líderes que querem resultados reais sem abrir mão de quem são.',
        },
      },
    ],
  },
  {
    type: 'form',
    label: 'Formulário',
    icon: '📋',
    desc: 'Captura de leads — nome, e-mail, WhatsApp',
    variants: [
      {
        label: 'Fundo azul — captura lead',
        content: {
          bg: 'blue',
          layout: 'centered',
          title: 'Acesse as ferramentas gratuitamente',
          submit_label: 'Quero as ferramentas',
          fields: [
            { field_key: 'nome', label: 'Seu nome', type: 'text', required: true },
            { field_key: 'email', label: 'E-mail', type: 'email', required: true },
            { field_key: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
          ],
        },
      },
      {
        label: 'Fundo branco — contato',
        content: {
          bg: 'white',
          layout: 'centered',
          title: 'Entre em contato',
          submit_label: 'Enviar mensagem',
          fields: [
            { field_key: 'nome', label: 'Nome', type: 'text', required: true },
            { field_key: 'email', label: 'E-mail', type: 'email', required: true },
            { field_key: 'mensagem', label: 'Mensagem', type: 'textarea', required: true },
          ],
        },
      },
    ],
  },
  {
    type: 'cta',
    label: 'CTA',
    icon: '📣',
    desc: 'Chamada para ação — botão de destaque',
    variants: [
      {
        label: 'Azul centralizado',
        content: {
          background: 'blue',
          align: 'center',
          title: 'Pronto para transformar sua liderança?',
          cta_text: 'Comprar o livro',
          cta_href: 'https://amazon.com.br',
        },
      },
      {
        label: 'Dourado',
        content: {
          background: 'gold',
          align: 'center',
          title: 'Participe do próximo treinamento',
          cta_text: 'Ver datas disponíveis',
          cta_href: '/mentoria',
        },
      },
      {
        label: 'Dark com imagem',
        content: {
          background: 'ink',
          align: 'left',
          title: 'O Método Gestor360® em suas mãos',
          cta_text: 'Pedir pelo site da DDM',
          cta_href: '/livro',
        },
      },
    ],
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: '❓',
    desc: 'Perguntas frequentes — accordion',
    variants: [
      {
        label: 'Canvas coluna simples',
        content: {
          bg: 'canvas',
          title: 'Perguntas frequentes',
          items: [
            { question: 'O livro é para qualquer empresa?', answer: 'Sim. O método foi desenvolvido especificamente para pequenas e médias empresas brasileiras.' },
            { question: 'Preciso do livro para acessar as ferramentas?', answer: 'Não. As ferramentas gratuitas estão disponíveis com o cadastro. O código do livro libera as ferramentas premium.' },
          ],
        },
      },
    ],
  },
  {
    type: 'depoimentos',
    label: 'Depoimentos',
    icon: '💬',
    desc: 'Prova social — avaliações de leitores',
    variants: [
      {
        label: 'Grid 3 colunas — do Supabase',
        content: {
          source: 'supabase',
          layout: 'grid',
          bg: 'canvas',
          title: 'O que dizem sobre o Gestor360®',
        },
      },
      {
        label: 'Carrossel — do Supabase',
        content: {
          source: 'supabase',
          layout: 'carousel',
          bg: 'white',
        },
      },
    ],
  },
  {
    type: 'capitulos',
    label: 'Capítulos',
    icon: '📖',
    desc: 'Os 10 capítulos do método',
    variants: [
      {
        label: 'Grid canvas',
        content: { bg: 'canvas', layout: 'grid' },
      },
      {
        label: 'Lista numerada',
        content: { bg: 'white', layout: 'numbered-list' },
      },
    ],
  },
  {
    type: 'autores',
    label: 'Autores',
    icon: '👤',
    desc: 'Flávio Di Morais e Marcelo Caetano',
    variants: [
      {
        label: 'Lado a lado canvas',
        content: {
          bg: 'canvas',
          layout: 'side-by-side',
          autores: [
            { nome: 'Flávio Di Morais', cargo: 'CEO da DDM Editora', bio: 'Fundador do método Gestor360®, empresário e autor.', foto_url: '' },
            { nome: 'Marcelo Caetano', cargo: 'Co-autor', bio: 'Especialista em gestão estratégica para PMEs.', foto_url: '' },
          ],
        },
      },
      {
        label: 'Empilhado branco',
        content: {
          bg: 'white',
          layout: 'stacked',
          autores: [
            { nome: 'Flávio Di Morais', cargo: 'CEO da DDM Editora', bio: 'Fundador do método Gestor360®, empresário e autor.', foto_url: '' },
            { nome: 'Marcelo Caetano', cargo: 'Co-autor', bio: 'Especialista em gestão estratégica para PMEs.', foto_url: '' },
          ],
        },
      },
    ],
  },
  {
    type: 'ferramentas',
    label: 'Ferramentas',
    icon: '🛠️',
    desc: 'Biblioteca de ferramentas com filtro por capítulo',
    variants: [
      {
        label: 'Grid completo',
        content: { layout: 'grid', mostrar_todos: true },
      },
      {
        label: 'Capítulo inicial',
        content: { layout: 'grid', capitulo_inicial: 1 },
      },
    ],
  },
]

export const TYPE_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  text: 'Texto',
  cards: 'Cards',
  ferramentas: 'Ferramentas',
  form: 'Formulário',
  faq: 'FAQ',
  cta: 'CTA',
  depoimentos: 'Depoimentos',
  capitulos: 'Capítulos',
  autores: 'Autores',
}

export const TYPE_ICONS: Record<SectionType, string> = {
  hero: '🎯',
  text: '📝',
  cards: '🃏',
  ferramentas: '🛠️',
  form: '📋',
  faq: '❓',
  cta: '📣',
  depoimentos: '💬',
  capitulos: '📖',
  autores: '👤',
}
