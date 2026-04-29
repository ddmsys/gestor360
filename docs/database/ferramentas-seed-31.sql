-- Gestor360 - Seed inicial das 31 ferramentas como rascunho.
-- Aplicar depois de `docs/database/ferramentas-admin.sql`.
-- Os arquivos podem ser ajustados depois que PDFs finais forem enviados ao bucket `ferramentas-pdf`.

insert into ferramentas (
  numero,
  nome,
  descricao,
  capitulo,
  tipo,
  status,
  acesso,
  ativo,
  ordem,
  arquivo_path,
  cor
)
values
  (1,  'GST', 'Ferramenta de planejamento para organizar a visão de gestão.', 1, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-01/01-gst.pdf', '#c0b4a8'),
  (2,  'PESTEL', 'Análise de contexto externo para decisões estratégicas.', 1, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-01/02-pestel.pdf', '#25346e'),
  (3,  'SWOT Comportamental', 'Leitura estratégica combinada com padrões comportamentais.', 1, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-01/03-swot-comportamental.pdf', '#d4a020'),

  (4,  '4 Níveis de Fala', 'Guia para ajustar a comunicação ao contexto e ao interlocutor.', 2, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-02/04-niveis-de-fala.pdf', '#25346e'),
  (5,  'Rapport', 'Prática para criar conexão e confiança nas conversas de gestão.', 2, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-02/05-rapport.pdf', '#c0b4a8'),
  (6,  'Metamodelo', 'Perguntas para qualificar informações e reduzir ambiguidades.', 2, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-02/06-metamodelo.pdf', '#d4a020'),
  (7,  'Reframing', 'Exercício para ressignificar situações e ampliar alternativas.', 2, 'individual', 'draft', 'gratuito', false, 4, 'capitulo-02/07-reframing.pdf', '#25346e'),

  (8,  'Mapa de Funções 360', 'Mapa para distribuir responsabilidades com clareza.', 3, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-03/08-mapa-de-funcoes-360.pdf', '#c0b4a8'),
  (9,  'Roda da Autonomia', 'Ferramenta para avaliar autonomia e orientar delegação.', 3, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-03/09-roda-da-autonomia.pdf', '#25346e'),
  (10, 'Mapa Circular', 'Visual para organizar relações, papéis e fluxos de decisão.', 3, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-03/10-mapa-circular.pdf', '#d4a020'),

  (11, 'Mapa de Crenças', 'Diagnóstico de crenças que influenciam a liderança.', 4, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-04/11-mapa-de-crencas.pdf', '#25346e'),
  (12, 'Ritual da Ação Consciente', 'Roteiro para transformar intenção em ação consistente.', 4, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-04/12-ritual-da-acao-consciente.pdf', '#c0b4a8'),

  (13, 'DRE', 'Estrutura para leitura prática do resultado financeiro.', 5, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-05/13-dre.pdf', '#d4a020'),
  (14, 'Formação de Preço', 'Ferramenta para precificação com base em custos, margem e valor.', 5, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-05/14-formacao-de-preco.pdf', '#25346e'),
  (15, 'Fluxo de Caixa', 'Controle para acompanhar entradas, saídas e previsibilidade.', 5, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-05/15-fluxo-de-caixa.pdf', '#c0b4a8'),
  (16, 'Diagnóstico 15min', 'Checklist rápido para leitura inicial da saúde financeira.', 5, 'individual', 'draft', 'gratuito', false, 4, 'capitulo-05/16-diagnostico-15min.pdf', '#d4a020'),

  (17, 'Roteiro da História de Valor', 'Estrutura para transformar proposta em narrativa comercial.', 6, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-06/17-roteiro-da-historia-de-valor.pdf', '#25346e'),

  (18, 'Diagnóstico de Clima', 'Leitura objetiva da percepção do time sobre o ambiente.', 7, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-07/18-diagnostico-de-clima.pdf', '#c0b4a8'),
  (19, 'Matriz de Desempenho', 'Matriz para avaliar entrega, comportamento e evolução.', 7, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-07/19-matriz-de-desempenho.pdf', '#25346e'),
  (20, 'Feedback SCI', 'Modelo para conversas de feedback claras e acionáveis.', 7, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-07/20-feedback-sci.pdf', '#d4a020'),
  (21, '1:1', 'Roteiro para reuniões individuais com foco em desenvolvimento.', 7, 'individual', 'draft', 'gratuito', false, 4, 'capitulo-07/21-1-1.pdf', '#25346e'),
  (22, 'Termômetro', 'Instrumento rápido para medir energia, alinhamento e atenção.', 7, 'individual', 'draft', 'gratuito', false, 5, 'capitulo-07/22-termometro.pdf', '#c0b4a8'),
  (23, 'Roda de Valores', 'Exercício para mapear valores que orientam decisões e cultura.', 7, 'individual', 'draft', 'gratuito', false, 6, 'capitulo-07/23-roda-de-valores.pdf', '#d4a020'),

  (24, 'Matriz de Risco', 'Matriz para classificar riscos por impacto e probabilidade.', 8, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-08/24-matriz-de-risco.pdf', '#25346e'),
  (25, 'Reversível x Irreversível', 'Critério para diferenciar decisões recuperáveis e críticas.', 8, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-08/25-reversivel-irreversivel.pdf', '#c0b4a8'),
  (26, 'Análise de Cenários', 'Estrutura para antecipar possibilidades e respostas.', 8, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-08/26-analise-de-cenarios.pdf', '#d4a020'),

  (27, 'Canvas de Autoaprendizado do Líder360', 'Mapa para planejar a evolução contínua do líder.', 9, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-09/27-canvas-de-autoaprendizado-do-lider360.pdf', '#25346e'),

  (28, 'Painel de Indicadores', 'Estrutura para organizar indicadores essenciais da gestão.', 10, 'individual', 'draft', 'gratuito', false, 1, 'capitulo-10/28-painel-de-indicadores.pdf', '#c0b4a8'),
  (29, 'OKRs', 'Ferramenta para conectar objetivos, resultados-chave e foco.', 10, 'individual', 'draft', 'gratuito', false, 2, 'capitulo-10/29-okrs.pdf', '#25346e'),
  (30, 'PDCA', 'Ciclo prático para melhoria contínua e execução disciplinada.', 10, 'individual', 'draft', 'gratuito', false, 3, 'capitulo-10/30-pdca.pdf', '#d4a020'),
  (31, 'Canvas da Inovação Ágil', 'Canvas para estruturar hipóteses, testes e aprendizado.', 10, 'individual', 'draft', 'gratuito', false, 4, 'capitulo-10/31-canvas-da-inovacao-agil.pdf', '#25346e')
on conflict do nothing;
