-- ─── SEED DE CONTEÚDO DAS 6 PÁGINAS PRINCIPAIS ──────────────────────────────
-- Migration idempotente: garante que as páginas existam e popula suas seções
-- somente se a página ainda não tiver seções.
-- Conteúdo extraído de docs/referencias/copy-final-site360.md e oGestor360_site_copy.md

-- ─── 1. GARANTIR QUE AS PÁGINAS EXISTAM E ESTEJAM PUBLICADAS ──────────────

INSERT INTO pages (slug, title, description, status)
VALUES
  ('home',        'Home',                       'Ecossistema para empresários que querem crescer com consciência: Manual, ferramentas, mentoria, clube e eventos Gestor360.', 'published'),
  ('livro',       'Manual do Gestor360',        'Conheça o Manual do Gestor360: livro com método, ferramentas e rituais para liderar, decidir e crescer com mais consciência.', 'published'),
  ('ferramentas', 'Ferramentas Gratuitas',      'Baixe canvases, matrizes e rituais do Gestor360 para aplicar planejamento, delegação, finanças, pessoas e decisão na sua empresa.', 'published'),
  ('mentoria',    'Conselheiros Gestor360',     'Fale com um Conselheiro Gestor360 e descubra o plano ideal para ganhar clareza, reduzir erros e acelerar decisões estratégicas.', 'published'),
  ('metodo',      'O Método Gestor360®',        'Conheça o método completo de liderança consciente para empresários — neurociência, PNL e gestão estratégica integrados.', 'published'),
  ('sobre',       'Flávio Di Morais e Marcelo Caetano', 'Conheça os autores do Manual do Gestor360 e a filosofia por trás do ecossistema de liderança integral para empresários.', 'published')
ON CONFLICT (slug) DO UPDATE SET status = 'published';

-- ─── HELPER: inserir seção apenas se a página ainda não tiver nenhuma ────────
-- Usamos DO $$ DECLARE ... END $$ para cada página

-- ═══════════════════════════════════════════════════════════════════════════
-- HOME
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'home';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "Sistema de Liderança Integral",
      "title": "Quando o líder muda, a empresa muda.",
      "subtitle": "O oGestor360 é o ecossistema para empresários que querem crescer com mais clareza, menos custo do erro e uma liderança capaz de sustentar o próximo ciclo da empresa.\n\nAqui, gestão não é apenas processo. É consciência, método e ação.",
      "cta_label": "Falar com um Conselheiro",
      "cta_href": "/mentoria",
      "cta_secondary_label": "Baixar ferramentas gratuitas",
      "cta_secondary_href": "/ferramentas",
      "image": "/Mockup_01.png"
    }'::jsonb);

    -- PROBLEMA (text section com cards de dor)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 1, true, '{
      "title": "Você faz muito. Mas sente que a empresa ainda depende demais de você.",
      "body": "Existe um ponto na trajetória de todo empresário em que trabalhar mais deixa de ser resposta.\n\nA empresa até cresce, mas o lucro não acompanha. O time até executa, mas ainda espera você decidir. As metas existem, mas a direção parece mudar toda semana. E no fim do dia, o peso das decisões continua voltando para a mesma pessoa: você.\n\nEsse não é um problema de esforço.\n\nÉ um problema de sistema.",
      "align": "center",
      "background": "canvas"
    }'::jsonb);

    -- BLOCOS DE DOR (cards)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 2, true, '{
      "title": "",
      "columns": 4,
      "items": [
        {
          "icon": "🔄",
          "title": "Trabalha muito, cresce pouco",
          "description": "O negócio se movimenta, mas a sensação é de que cada avanço cobra energia demais."
        },
        {
          "icon": "👤",
          "title": "Centralização invisível",
          "description": "Tudo passa por você. Mesmo quando há equipe, as decisões continuam presas no dono."
        },
        {
          "icon": "📉",
          "title": "Faturamento sem clareza",
          "description": "As vendas acontecem, mas o caixa, a margem e o lucro continuam difíceis de enxergar."
        },
        {
          "icon": "🧑‍🤝‍🧑",
          "title": "Time sem autonomia",
          "description": "As pessoas trabalham, mas ainda não assumem o nível de responsabilidade que a empresa precisa."
        }
      ]
    }'::jsonb);

    -- VIRADA
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 3, true, '{
      "title": "O que levou sua empresa até aqui não é necessariamente o que vai levá-la adiante.",
      "body": "Toda empresa que cresce revela os limites do modelo de liderança que a trouxe até esse ponto.\n\nNo começo, decidir tudo pode parecer velocidade. Depois, vira gargalo. Controlar tudo pode parecer cuidado. Depois, vira dependência. Resolver tudo pode parecer força. Depois, vira exaustão.\n\nO Gestor360 nasce dessa virada: o momento em que o empresário entende que a empresa só muda de verdade quando a forma de pensar, decidir e agir da liderança também muda.",
      "align": "center",
      "background": "white"
    }'::jsonb);

    -- SOLUÇÃO (ecossistema — cards)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 4, true, '{
      "title": "Um ecossistema completo para o empresário que quer crescer com inteligência.",
      "subtitle": "O oGestor360 não é apenas um livro, uma mentoria ou um clube. É um sistema vivo para transformar conhecimento em ação, ação em aprendizado e aprendizado em crescimento sustentável.",
      "columns": 3,
      "items": [
        {
          "icon": "📘",
          "title": "O livro que organiza o método",
          "description": "10 dimensões da liderança integral, ferramentas práticas e rituais de aplicação para empresários que querem sair do improviso.",
          "cta_label": "Conhecer o Manual",
          "cta_href": "/livro"
        },
        {
          "icon": "🛠️",
          "title": "A gestão aplicada no papel",
          "description": "Canvases, matrizes e rituais para transformar reflexão em decisão dentro da sua empresa.",
          "cta_label": "Baixar ferramentas",
          "cta_href": "/ferramentas"
        },
        {
          "icon": "🎯",
          "title": "Acompanhamento estratégico para decidir melhor",
          "description": "Mentoria com conselheiros para empresários que querem clareza, diagnóstico e direção para o próximo ciclo.",
          "cta_label": "Falar com um Conselheiro",
          "cta_href": "/mentoria"
        }
      ]
    }'::jsonb);

    -- MÉTODO (GST)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 5, true, '{
      "title": "A base de tudo: clareza, desafio, compromisso, feedback e complexidade.",
      "body": "O Gestor360 combina neurociência, PNL, filosofia e gestão estratégica para ajudar o líder a observar melhor a empresa e agir com mais maturidade.\n\nNão é uma promessa de fórmula pronta. É um método para pensar, decidir, comunicar, delegar, medir e evoluir.\n\n**Clareza** — Saber onde a empresa está, o que precisa mudar e qual decisão vem primeiro.\n**Desafio** — Definir metas que ativam crescimento sem paralisar a equipe.\n**Compromisso** — Criar cultura de responsabilidade, cadência e execução.\n**Feedback** — Aprender com conversas, indicadores e ciclos de revisão.\n**Complexidade** — Navegar incertezas sem perder serenidade, método e direção.",
      "align": "left",
      "background": "canvas"
    }'::jsonb);

    -- AUTORES
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'autores', 6, true, '{
      "title": "Criado por quem vive os bastidores reais do empreendedorismo.",
      "subtitle": "Flávio Di Morais e Marcelo Caetano construíram o Gestor360 a partir de conversas reais com líderes reais: empresários que carregam decisões difíceis, equipes para conduzir, números para sustentar e um desejo profundo de crescer sem se perder de si mesmos.",
      "cta_label": "Conhecer os autores",
      "cta_href": "/sobre",
      "autores": [
        {
          "nome": "Flávio Di Morais",
          "cargo": "Fundador • Publisher • @oCaraDoLivro",
          "foto": "/FLAVIO.jpg",
          "bio": "Com mais de 32 anos à frente da DDM Editora, Flávio criou o oGestor360 a partir da convicção de que não há livro mais poderoso do que aquele que o líder aplica na própria empresa — com método, consciência e propósito."
        },
        {
          "nome": "Marcelo Caetano",
          "cargo": "Co-autor • Estrategista • Fundador Seg Contábil",
          "foto": "/MARCELO.jpg",
          "bio": "Empresário e estrategista com visão de que resultados consistentes nascem da convergência entre propósito, ação disciplinada e visão de longo prazo — o núcleo da filosofia do Gestor360."
        }
      ]
    }'::jsonb);

    -- LEAD MAGNET
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'form', 7, true, '{
      "title": "Baixe as ferramentas do Gestor360 gratuitamente.",
      "subtitle": "Receba modelos prontos para aplicar na sua empresa: Canvas do Líder360, SWOT Comportamental, DRE Simplificada, Fluxo de Caixa 90 Dias, Matriz de Risco e outras ferramentas do método.",
      "microcopy": "Use individualmente, em reuniões de equipe ou como ponto de partida para uma conversa com um Conselheiro.",
      "cta_label": "Quero as ferramentas gratuitas",
      "show_whatsapp": true
    }'::jsonb);

    -- FAQ
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'faq', 8, true, '{
      "title": "Perguntas frequentes",
      "items": [
        {
          "question": "O que é o oGestor360?",
          "answer": "É um ecossistema de liderança integral para empresários, formado por Manual, ferramentas, mentoria, clube, eventos e conteúdos."
        },
        {
          "question": "O Gestor360 é um curso?",
          "answer": "Não. O Gestor360 é um sistema vivo de gestão e autodesenvolvimento. Ele pode ser estudado, aplicado em equipe e aprofundado com mentoria."
        },
        {
          "question": "Por onde devo começar?",
          "answer": "Se você quer entender o método, comece pelo Manual. Se quer aplicar algo agora, baixe as ferramentas. Se precisa de clareza estratégica, fale com um Conselheiro."
        }
      ]
    }'::jsonb);

    -- CTA FINAL
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 9, true, '{
      "title": "Por onde faz mais sentido começar?",
      "subtitle": "Cada empresário chega ao Gestor360 em um momento diferente. Escolha a entrada mais útil para o seu próximo passo.",
      "cta_label": "Falar com um Conselheiro",
      "cta_href": "/mentoria",
      "cta_secondary_label": "Baixar ferramentas",
      "cta_secondary_href": "/ferramentas",
      "background": "ink"
    }'::jsonb);

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- LIVRO
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'livro';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "Mais do que um livro. Um sistema vivo.",
      "title": "Manual do Gestor360®",
      "subtitle": "Para líderes que querem inspirar, evoluir e prosperar com consciência.\n\n10 dimensões da liderança integral, ferramentas práticas e rituais de aplicação para empresários que querem tomar decisões melhores, desenvolver equipes mais maduras e crescer com mais clareza.",
      "cta_label": "Adquirir o Manual",
      "cta_href": "https://www.ddmeditora.com.br",
      "cta_secondary_label": "Baixar ferramentas grátis",
      "cta_secondary_href": "/ferramentas",
      "microcopy": "Publicado pela DDM Editora, selo Aurora Books · 168 páginas · ISBN 978-85-66791-96-1",
      "image": "/Capa_livro.png"
    }'::jsonb);

    -- O QUE É
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 1, true, '{
      "title": "Um espelho para o líder que quer ver o que ainda não enxerga.",
      "body": "O Manual do Gestor360 não foi criado para ser consumido rapidamente. Ele foi desenhado para ser praticado em ciclos.\n\nCada capítulo representa uma dimensão da liderança consciente. A cada releitura, o conteúdo ganha outro significado, porque o líder que volta ao método já não é o mesmo que começou.\n\nVocê pode usar o Manual de duas formas complementares:\n\n✦ Como jornada individual de autodesenvolvimento.\n✦ Como metodologia de gestão integrada para desenvolver a equipe.",
      "align": "left",
      "background": "white"
    }'::jsonb);

    -- PARA QUEM É
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 2, true, '{
      "title": "Este livro é para quem está cansado de crescer apenas no braço.",
      "body": "• Para empresários que vivem apagando incêndios.\n• Para gestores que carregam decisões demais.\n• Para líderes que querem delegar melhor sem perder clareza.\n• Para empresas que precisam alinhar planejamento, pessoas, finanças, vendas e performance.\n• Para quem entende que liderar não é controlar tudo, mas criar um sistema que evolui.",
      "align": "center",
      "background": "canvas"
    }'::jsonb);

    -- 10 DIMENSÕES (capítulos)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'capitulos', 3, true, '{
      "title": "10 dimensões. 10 conjuntos de ferramentas. Uma jornada de transformação.",
      "items": [
        { "numero": 1, "titulo": "Planejamento Estratégico", "resultado": "Clareza de direção com método e visão humana.", "ferramentas": "GST · PESTEL · SWOT Comportamental" },
        { "numero": 2, "titulo": "Dominando a Comunicação", "resultado": "Conversas que geram confiança e ação.", "ferramentas": "4 Níveis de Fala · Rapport · Metamodelo · Reframing" },
        { "numero": 3, "titulo": "Delegação Inteligente", "resultado": "Menos centralização e mais autonomia.", "ferramentas": "Mapa de Funções 360 · Roda da Autonomia" },
        { "numero": 4, "titulo": "Mentalidade e Crenças", "resultado": "Identificação de padrões que sabotam crescimento.", "ferramentas": "Mapa de Crenças · Ritual da Ação Consciente" },
        { "numero": 5, "titulo": "Saúde Financeira", "resultado": "Leitura simples e consciente dos números.", "ferramentas": "DRE · Formação de Preço · Fluxo de Caixa 90 Dias" },
        { "numero": 6, "titulo": "Marketing e Vendas", "resultado": "Venda autêntica como extensão do propósito.", "ferramentas": "Roteiro da História de Valor" },
        { "numero": 7, "titulo": "Gestão de Pessoas", "resultado": "Cultura de resultado com maturidade.", "ferramentas": "Matriz de Desempenho · Feedback SCI · Termômetro Emocional" },
        { "numero": 8, "titulo": "Tomada de Decisão", "resultado": "Menos custo do erro e mais serenidade.", "ferramentas": "Matriz de Risco · Decisão Reversível × Irreversível" },
        { "numero": 9, "titulo": "Autodesenvolvimento do Líder", "resultado": "Um mapa pessoal de evolução contínua.", "ferramentas": "Canvas do Líder 360" },
        { "numero": 10, "titulo": "Performance e Inovação", "resultado": "Indicadores, ritmo e melhoria constante.", "ferramentas": "OKRs · PDCA · Painel de Indicadores Vitais" }
      ]
    }'::jsonb);

    -- DIFERENCIAIS
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 4, true, '{
      "title": "O que torna o Manual diferente de um livro comum de gestão?",
      "columns": 2,
      "items": [
        {
          "icon": "🔗",
          "title": "Método integrado",
          "description": "O Manual não trata planejamento, comunicação, delegação, finanças e pessoas como temas soltos. Ele mostra como essas dimensões se conectam na vida real de uma empresa."
        },
        {
          "icon": "🛠️",
          "title": "Ferramentas práticas",
          "description": "Cada dimensão acompanha ferramentas visuais para aplicar o conteúdo em decisões, reuniões, diagnósticos e ciclos de revisão."
        },
        {
          "icon": "🔄",
          "title": "Leitura cíclica",
          "description": "O Manual foi criado para ser revisitado. O valor está menos em terminar o livro e mais em voltar a ele com mais maturidade."
        },
        {
          "icon": "👥",
          "title": "Individual ou em equipe",
          "description": "O método funciona como trilha pessoal do líder e também como linguagem comum para desenvolver equipes."
        }
      ]
    }'::jsonb);

    -- QUOTE DO PREFÁCIO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 5, true, '{
      "title": "",
      "body": "\"Este livro é para quem está cansado de apagar incêndios. Para quem sente que a empresa até anda, mas poderia voar. E, principalmente, para quem entendeu que não dá mais para crescer só no braço — é preciso crescer com clareza, consciência e responsabilidade.\"\n\n— Geraldo Rufino, prefácio do Manual do Gestor360®",
      "align": "center",
      "background": "ink"
    }'::jsonb);

    -- TRILHA DOS 90 DIAS
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 6, true, '{
      "title": "Uma jornada prática para reorganizar liderança, empresa e decisões.",
      "subtitle": "Siga a trilha dos 90 dias com o método Gestor360.",
      "columns": 3,
      "items": [
        {
          "icon": "📍",
          "title": "Fase 1: Clareza e presença (30 dias)",
          "description": "O líder observa como decide, comunica, reage sob pressão e organiza prioridades."
        },
        {
          "icon": "🏗️",
          "title": "Fase 2: Estrutura e alinhamento (dias 31–60)",
          "description": "O foco passa para delegação, papéis, acordos, pessoas e critérios de decisão."
        },
        {
          "icon": "🚀",
          "title": "Fase 3: Consolidação e visão de futuro (dias 61–90)",
          "description": "O método entra em revisão, indicadores, finanças e sustentabilidade do crescimento."
        }
      ]
    }'::jsonb);

    -- FAQ
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'faq', 7, true, '{
      "title": "Perguntas sobre o Manual",
      "items": [
        {
          "question": "O Manual é indicado para quem?",
          "answer": "Para empresários, gestores e líderes que querem desenvolver clareza, maturidade, autonomia de equipe e consciência nas decisões."
        },
        {
          "question": "O livro é teórico ou prático?",
          "answer": "Ele une reflexão e prática. Cada dimensão traz conceitos, ferramentas, rituais e perguntas de aplicação."
        },
        {
          "question": "Preciso ler em ordem?",
          "answer": "Existe uma arquitetura clara, mas o Manual foi criado para ser revisitado conforme o momento da empresa e do líder."
        },
        {
          "question": "O Manual substitui a mentoria?",
          "answer": "Não. O Manual organiza o método. A mentoria ajuda a aplicar o método com diagnóstico, direção e acompanhamento."
        }
      ]
    }'::jsonb);

    -- CTA FINAL
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 8, true, '{
      "title": "Comece pelo Manual. Aplique com método. Aprofunde com acompanhamento.",
      "subtitle": "O Manual é o ponto de partida do ecossistema Gestor360. Se quiser aplicar as ferramentas com mais clareza, você também pode falar com um Conselheiro.",
      "cta_label": "Adquirir o Manual",
      "cta_href": "https://www.ddmeditora.com.br",
      "cta_secondary_label": "Falar com um Conselheiro",
      "cta_secondary_href": "/mentoria",
      "background": "blue"
    }'::jsonb);

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- FERRAMENTAS
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'ferramentas';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "Gestão na prática, hoje",
      "title": "Baixe as ferramentas do Gestor360 sem custo.",
      "subtitle": "Receba canvases, matrizes e rituais prontos para aplicar na sua empresa. São ferramentas criadas para transformar leitura em ação, reflexão em decisão e liderança em prática.",
      "cta_label": "Quero as ferramentas gratuitas",
      "cta_href": "#formulario",
      "microcopy": "Você receberá os materiais por e-mail. Seus dados estão seguros.",
      "image": "/Mockup_02.png"
    }'::jsonb);

    -- O QUE SÃO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 1, true, '{
      "title": "Ferramentas para organizar a empresa começando pela consciência do líder.",
      "body": "Cada capítulo do Manual do Gestor360 acompanha ferramentas práticas em formato de aplicação. Elas podem ser usadas individualmente, em reuniões de equipe, em treinamentos internos ou como parte de um ciclo trimestral de revisão.\n\nEssas ferramentas não existem para deixar a empresa mais burocrática. Elas existem para ajudar o líder a enxergar melhor antes de decidir.\n\n> Não são ferramentas para preencher planilhas. São ferramentas para enxergar padrões, alinhar pessoas e tomar decisões melhores.",
      "align": "left",
      "background": "white"
    }'::jsonb);

    -- LISTA DE FERRAMENTAS
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'ferramentas', 2, true, '{
      "title": "O que você vai receber",
      "show_all": false,
      "featured": ["SWOT Comportamental", "Canvas do Líder 360", "DRE Simplificada", "Fluxo de Caixa 90 Dias", "Matriz de Risco", "Termômetro Emocional"]
    }'::jsonb);

    -- FORMULÁRIO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'form', 3, true, '{
      "id": "formulario",
      "title": "Receba as ferramentas no seu e-mail.",
      "cta_label": "Quero receber as ferramentas",
      "show_whatsapp": true,
      "show_segmento": true,
      "microcopy": "Ao enviar, você também poderá receber conteúdos do Gestor360 sobre liderança, gestão e crescimento empresarial. Você pode sair da lista quando quiser."
    }'::jsonb);

    -- PÓS FORMULÁRIO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 4, true, '{
      "title": "Quer aplicar as ferramentas com mais clareza?",
      "subtitle": "Se você já sabe que o desafio da sua empresa exige mais do que baixar um material, fale com um Conselheiro Gestor360. A conversa ajuda a identificar qual ponto merece atenção primeiro.",
      "cta_label": "Falar com um Conselheiro",
      "cta_href": "/mentoria",
      "background": "canvas"
    }'::jsonb);

    -- FAQ
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'faq', 5, true, '{
      "title": "Perguntas sobre as ferramentas",
      "items": [
        {
          "question": "As ferramentas são gratuitas?",
          "answer": "Sim. Elas funcionam como porta de entrada prática para o método Gestor360."
        },
        {
          "question": "Preciso comprar o Manual para usar?",
          "answer": "Não. Mas o Manual aprofunda o contexto e mostra como cada ferramenta se conecta às dimensões da liderança."
        },
        {
          "question": "Posso usar com minha equipe?",
          "answer": "Sim. Muitas ferramentas foram pensadas para conversas, reuniões e ciclos de revisão em equipe."
        },
        {
          "question": "Como recebo os arquivos?",
          "answer": "Após preencher o formulário, você recebe as ferramentas pelo e-mail informado."
        }
      ]
    }'::jsonb);

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- MENTORIA
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'mentoria';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "Programa de Mentoria Estratégica",
      "title": "Estratégia. Clareza. Decisão. Com quem já esteve onde você quer chegar.",
      "subtitle": "O Programa Conselheiros Gestor360 é o acompanhamento estratégico para empresários que querem reduzir o custo do erro, enxergar o próximo passo com mais clareza e conduzir a empresa com mais maturidade.",
      "cta_label": "Falar com um Conselheiro",
      "cta_href": "#conversa",
      "cta_secondary_label": "Conhecer os planos",
      "cta_secondary_href": "#planos",
      "microcopy": "A conversa inicial ajuda a entender seu momento e indicar o melhor ponto de partida."
    }'::jsonb);

    -- PARA QUEM É
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 1, true, '{
      "title": "Para o empresário que sabe que precisa decidir melhor, não apenas trabalhar mais.",
      "body": "• A empresa cresce, mas o lucro não acompanha.\n• As decisões mais importantes continuam recaindo sobre você.\n• O time não performa no nível que a empresa precisa.\n• Falta clareza sobre o próximo movimento estratégico.\n• Você sente que está pagando caro por decisões tomadas no improviso.\n• Já percebeu que aplicar um método sozinho tem limite.",
      "align": "left",
      "background": "canvas"
    }'::jsonb);

    -- O QUE MUDA
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 2, true, '{
      "title": "Um Conselheiro não decide por você. Ele ajuda você a enxergar melhor antes de decidir.",
      "body": "Empresários costumam carregar decisões em silêncio. O problema é que, quanto mais a empresa cresce, mais caro fica decidir sem clareza.\n\nA mentoria Conselheiros Gestor360 existe para criar um espaço de diagnóstico, orientação e acompanhamento. Um lugar para organizar prioridades, revisar riscos, alinhar pessoas, enxergar indicadores e transformar intenção em plano de ação.",
      "align": "center",
      "background": "white"
    }'::jsonb);

    -- PLANOS
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 3, true, '{
      "id": "planos",
      "title": "Escolha o seu plano",
      "columns": 3,
      "items": [
        {
          "icon": "🥈",
          "title": "Silver",
          "subtitle": "Direcionamento estratégico",
          "description": "Para empresários que precisam de clareza e orientação para o próximo passo.\n\n• Sessões de conselheiro de 30 minutos\n• Direcionamento estratégico personalizado\n• Acesso ao material do ecossistema Gestor360",
          "cta_label": "Descobrir se o Silver faz sentido",
          "cta_href": "#conversa"
        },
        {
          "icon": "🥇",
          "title": "Gold",
          "subtitle": "Diagnóstico + Estratégia + Marketing",
          "description": "Para empresários prontos para um salto estratégico com suporte mais completo.\n\n• Tudo do Silver\n• Diagnóstico completo da empresa\n• Consultoria de marketing integrada\n• Acompanhamento de indicadores",
          "cta_label": "Conversar sobre o Gold",
          "cta_href": "#conversa",
          "featured": true
        },
        {
          "icon": "🖤",
          "title": "Black",
          "subtitle": "Acompanhamento premium de alto impacto",
          "description": "Para empresários que querem suporte próximo, presença e velocidade.\n\n• Tudo do Gold\n• 42 semanas de acompanhamento contínuo\n• Reuniões de mapeamento detalhado\n• Visitas presenciais dos conselheiros\n• Acesso prioritário e dedicação exclusiva",
          "cta_label": "Avaliar o plano Black",
          "cta_href": "#conversa"
        }
      ]
    }'::jsonb);

    -- COMO FUNCIONA
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 4, true, '{
      "id": "conversa",
      "title": "Antes de falar de plano, precisamos entender o seu momento.",
      "columns": 3,
      "items": [
        {
          "icon": "1️⃣",
          "title": "Contexto",
          "description": "Você compartilha onde a empresa está hoje e qual desafio pesa mais."
        },
        {
          "icon": "2️⃣",
          "title": "Clareza",
          "description": "O Conselheiro ajuda a organizar o problema principal e separar sintoma de causa."
        },
        {
          "icon": "3️⃣",
          "title": "Direção",
          "description": "Você recebe uma orientação sobre o melhor ponto de partida dentro do ecossistema Gestor360."
        }
      ]
    }'::jsonb);

    -- FILOSOFIA
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 5, true, '{
      "title": "",
      "body": "\"Liderar não é apenas conduzir pessoas. É aprender a se conduzir com presença, serenidade e consciência.\"\n\n— Flávio Di Morais e Marcelo Caetano",
      "align": "center",
      "background": "ink"
    }'::jsonb);

    -- FAQ
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'faq', 6, true, '{
      "title": "Perguntas sobre a mentoria",
      "items": [
        {
          "question": "Como funciona a mentoria Conselheiros Gestor360?",
          "answer": "Funciona como acompanhamento estratégico para empresários, com diagnóstico, orientação e apoio para decisões de gestão, liderança e crescimento."
        },
        {
          "question": "Qual a diferença entre Silver, Gold e Black?",
          "answer": "O Silver foca em direcionamento. O Gold aprofunda diagnóstico, estratégia e marketing. O Black oferece acompanhamento premium de longo prazo."
        },
        {
          "question": "Preciso conhecer o Manual antes?",
          "answer": "Não é obrigatório, mas o Manual ajuda a entender a linguagem e as ferramentas do método."
        },
        {
          "question": "A conversa inicial já me compromete com algum plano?",
          "answer": "Não. A conversa serve para entender o momento da empresa e indicar o caminho mais adequado."
        }
      ]
    }'::jsonb);

    -- CTA FINAL
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 7, true, '{
      "title": "Não sabe qual plano faz sentido para sua empresa?",
      "subtitle": "Fale com um Conselheiro e descubra o ponto de partida ideal para o seu momento.",
      "cta_label": "Falar com um Conselheiro",
      "cta_href": "#conversa",
      "background": "blue"
    }'::jsonb);

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- MÉTODO
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'metodo';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "O Método Gestor360®",
      "title": "Um método para pensar, decidir, comunicar, delegar, medir e evoluir.",
      "subtitle": "O Gestor360 combina neurociência, PNL, filosofia e gestão estratégica para criar um sistema vivo de liderança consciente — desenvolvido para empresários que precisam de mais do que motivação.",
      "cta_label": "Conhecer o Manual",
      "cta_href": "/livro",
      "cta_secondary_label": "Baixar ferramentas gratuitas",
      "cta_secondary_href": "/ferramentas"
    }'::jsonb);

    -- O MODELO GST
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 1, true, '{
      "title": "A base de tudo: o Modelo GST",
      "body": "Um método proprietário desenvolvido a partir da convergência entre neurociência, PNL e gestão estratégica.\n\nO Modelo GST parte de uma constatação: líderes eficazes não são os que trabalham mais — são os que organizam melhor sua atenção, intenção e ação. O modelo foi desenvolvido para ajudar o empresário a construir e sustentar esse padrão de consciência aplicada.",
      "align": "left",
      "background": "white"
    }'::jsonb);

    -- 5 PILARES
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 2, true, '{
      "title": "Os 5 pilares do Modelo GST",
      "columns": 5,
      "items": [
        {
          "icon": "🔍",
          "title": "Clareza",
          "description": "Saber onde a empresa está, o que precisa mudar e qual decisão vem primeiro."
        },
        {
          "icon": "🎯",
          "title": "Desafio",
          "description": "Definir metas que ativam crescimento sem paralisar a equipe."
        },
        {
          "icon": "🤝",
          "title": "Compromisso",
          "description": "Criar cultura de responsabilidade, cadência e execução."
        },
        {
          "icon": "🔁",
          "title": "Feedback",
          "description": "Aprender com conversas, indicadores e ciclos de revisão."
        },
        {
          "icon": "🌊",
          "title": "Complexidade",
          "description": "Navegar incertezas sem perder serenidade, método e direção."
        }
      ]
    }'::jsonb);

    -- QUOTE
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 3, true, '{
      "title": "",
      "body": "\"Empresas não evoluem quando apenas processos mudam. Elas evoluem quando a forma de pensar, decidir e agir da liderança se transforma.\"\n\n— Flávio Di Morais & Marcelo Caetano",
      "align": "center",
      "background": "ink"
    }'::jsonb);

    -- 10 DIMENSÕES
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'capitulos', 4, true, '{
      "title": "10 dimensões da liderança integral",
      "subtitle": "Cada capítulo do Manual representa uma dimensão — com ferramentas, rituais e resultados esperados.",
      "items": [
        { "numero": 1, "titulo": "Planejamento Estratégico", "resultado": "Clareza de direção com método e visão humana.", "ferramentas": "GST · PESTEL · SWOT Comportamental" },
        { "numero": 2, "titulo": "Dominando a Comunicação", "resultado": "Conversas que geram confiança e ação.", "ferramentas": "4 Níveis de Fala · Rapport · Metamodelo · Reframing" },
        { "numero": 3, "titulo": "Delegação Inteligente", "resultado": "Menos centralização e mais autonomia.", "ferramentas": "Mapa de Funções 360 · Roda da Autonomia" },
        { "numero": 4, "titulo": "Mentalidade e Crenças", "resultado": "Identificação de padrões que sabotam crescimento.", "ferramentas": "Mapa de Crenças · Ritual da Ação Consciente" },
        { "numero": 5, "titulo": "Saúde Financeira", "resultado": "Leitura simples e consciente dos números.", "ferramentas": "DRE · Formação de Preço · Fluxo de Caixa 90 Dias" },
        { "numero": 6, "titulo": "Marketing e Vendas", "resultado": "Venda autêntica como extensão do propósito.", "ferramentas": "Roteiro da História de Valor" },
        { "numero": 7, "titulo": "Gestão de Pessoas", "resultado": "Cultura de resultado com maturidade.", "ferramentas": "Matriz de Desempenho · Feedback SCI · Termômetro Emocional" },
        { "numero": 8, "titulo": "Tomada de Decisão", "resultado": "Menos custo do erro e mais serenidade.", "ferramentas": "Matriz de Risco · Decisão Reversível × Irreversível" },
        { "numero": 9, "titulo": "Autodesenvolvimento do Líder", "resultado": "Um mapa pessoal de evolução contínua.", "ferramentas": "Canvas do Líder 360" },
        { "numero": 10, "titulo": "Performance e Inovação", "resultado": "Indicadores, ritmo e melhoria constante.", "ferramentas": "OKRs · PDCA · Painel de Indicadores Vitais" }
      ]
    }'::jsonb);

    -- AUTORES
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'autores', 5, true, '{
      "title": "Criado por empresários. Testado na prática.",
      "subtitle": "O Gestor360 não nasceu em laboratório. Nasceu em salas de reunião reais, com decisões reais — e evoluiu com cada empresário que aplicou o método.",
      "cta_label": "Conhecer os autores",
      "cta_href": "/sobre",
      "autores": [
        {
          "nome": "Flávio Di Morais",
          "cargo": "Fundador • Publisher • @oCaraDoLivro",
          "foto": "/FLAVIO.jpg",
          "bio": "32 anos à frente da DDM Editora. Criou o oGestor360 a partir da convicção de que o método mais poderoso é aquele que o líder aplica na própria empresa."
        },
        {
          "nome": "Marcelo Caetano",
          "cargo": "Co-autor • Estrategista • Fundador Seg Contábil",
          "foto": "/MARCELO.jpg",
          "bio": "Empresário e estrategista. Fundador da Seg Organização Contábil, onde transformou um negócio técnico em empresa de cultura de alta performance."
        }
      ]
    }'::jsonb);

    -- CTA FINAL
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 6, true, '{
      "title": "Pronto para aplicar o método?",
      "subtitle": "Comece pelo Manual para entender as 10 dimensões, ou baixe as ferramentas e aplique agora.",
      "cta_label": "Conhecer o Manual",
      "cta_href": "/livro",
      "cta_secondary_label": "Baixar ferramentas gratuitas",
      "cta_secondary_href": "/ferramentas",
      "background": "blue"
    }'::jsonb);

  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SOBRE
-- ═══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'sobre';
  IF (SELECT COUNT(*) FROM page_sections WHERE page_id = v_page_id) = 0 THEN

    -- HERO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'hero', 0, true, '{
      "eyebrow": "Os criadores do Gestor360",
      "title": "Construído por empresários. Para empresários.",
      "subtitle": "O Gestor360 não nasceu em um laboratório de teorias. Nasceu em salas de reunião, madrugadas de decisão, conversas com líderes e na prática de quem sabe que liderar é servir com estratégia."
    }'::jsonb);

    -- AUTORES (seção completa)
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'autores', 1, true, '{
      "title": "Os autores",
      "autores": [
        {
          "nome": "Flávio Di Morais",
          "cargo": "Fundador · Publisher · @oCaraDoLivro",
          "foto": "/FLAVIO.jpg",
          "bio": "Com mais de 32 anos à frente da DDM Editora, Flávio Di Morais tem uma trajetória singular na interseção entre negócios, editorial e desenvolvimento humano. É Publisher, empreendedor e um dos principais nomes do mercado editorial brasileiro.\n\nCriou o oGestor360 a partir da convicção de que não há livro mais poderoso do que aquele que o líder aplica na própria empresa — com método, consciência e propósito."
        },
        {
          "nome": "Marcelo Caetano",
          "cargo": "Co-autor · Estrategista · Fundador Seg Organização Contábil",
          "foto": "/MARCELO.jpg",
          "bio": "Marcelo Caetano é empresário, estrategista e fundador da Seg Organização Contábil — onde transformou um negócio técnico em uma empresa de cultura de alta performance.\n\nSua visão de que resultados consistentes não são fruto do acaso, mas da convergência entre propósito, ação disciplinada e visão de longo prazo, se tornou o núcleo da filosofia do Gestor360."
        }
      ]
    }'::jsonb);

    -- FILOSOFIA
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 2, true, '{
      "title": "O que os une",
      "body": "\"Este livro foi escrito para quem acredita que liberdade e responsabilidade caminham juntas. Que liderar é servir, e que servir é o ato mais nobre de empreender. Que toda empresa é uma extensão da consciência de quem a lidera.\"\n\n— Flávio Di Morais & Marcelo Caetano",
      "align": "center",
      "background": "ink"
    }'::jsonb);

    -- 4 PRINCÍPIOS
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cards', 3, true, '{
      "title": "4 princípios inegociáveis do Gestor360",
      "columns": 4,
      "items": [
        {
          "icon": "🕊️",
          "title": "Liberdade",
          "description": "Como expressão da consciência criadora."
        },
        {
          "icon": "⚖️",
          "title": "Responsabilidade",
          "description": "Como a forma mais nobre de poder."
        },
        {
          "icon": "✨",
          "title": "Prosperidade",
          "description": "Como reflexo da coerência entre propósito e execução."
        },
        {
          "icon": "❤️",
          "title": "Amor",
          "description": "Como energia organizadora da cultura e dos resultados."
        }
      ]
    }'::jsonb);

    -- O LIVRO
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'text', 4, true, '{
      "title": "O Manual — 168 páginas de método aplicado",
      "body": "Publicado pela DDM Editora sob o selo Aurora Books, o Manual do Gestor360® reúne 10 dimensões da liderança integral, ferramentas práticas e rituais de aplicação.\n\nISBN: 978-85-66791-96-1 · 1ª edição 2026 · Prefácio: Geraldo Rufino\nDireção de Arte: Daiana Di Morais",
      "align": "left",
      "background": "canvas",
      "image": "/Capa_livro.png"
    }'::jsonb);

    -- CTA FINAL
    INSERT INTO page_sections (page_id, type, order_index, visible, content) VALUES
    (v_page_id, 'cta', 5, true, '{
      "title": "Pronto para entrar no ecossistema?",
      "subtitle": "Escolha o seu ponto de entrada e comece hoje.",
      "cta_label": "Pegar o Manual",
      "cta_href": "/livro",
      "cta_secondary_label": "Falar com um Conselheiro",
      "cta_secondary_href": "/mentoria",
      "background": "blue"
    }'::jsonb);

  END IF;
END $$;
