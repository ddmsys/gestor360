import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface BoasVindasProps {
  nome: string
  capitulo?: number
  capituloTitulo?: string
}

export default function BoasVindas({ nome, capitulo, capituloTitulo }: BoasVindasProps) {
  const preview = capitulo
    ? `Suas ferramentas do Capítulo ${capitulo} estão aqui!`
    : 'Bem-vindo ao Gestor360® — suas ferramentas chegaram!'

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Logo / Cabeçalho */}
          <Section style={header}>
            <Text style={logo}>
              <span style={{ color: '#8B8B8B' }}>3</span>
              <span style={{ color: '#1F3F7A' }}>6</span>
              <span style={{ color: '#D4A020' }}>0</span>
              {' '}Gestor
            </Text>
          </Section>

          {/* Corpo */}
          <Section style={content}>
            <Heading style={h1}>Olá, {nome}!</Heading>

            {capitulo && capituloTitulo ? (
              <>
                <Text style={p}>
                  Suas ferramentas do <strong>Capítulo {capitulo} — {capituloTitulo}</strong> estão prontas para download.
                </Text>
                <Text style={p}>
                  Você já pode acessá-las gratuitamente no link abaixo.
                </Text>
              </>
            ) : (
              <Text style={p}>
                Bem-vindo ao Gestor360®! Suas ferramentas práticas estão prontas para você começar a transformar sua gestão.
              </Text>
            )}

            <Button
              href={`https://ogestor360.com/ferramentas${capitulo ? `?capitulo=${capitulo}` : ''}`}
              style={button}
            >
              Acessar minhas ferramentas →
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              Tem o livro? Insira o código impresso no site para desbloquear todas as 31 ferramentas.
            </Text>
          </Section>

          {/* Rodapé */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Gestor360® — DDM Editora{'\n'}
              Você está recebendo este e-mail porque se cadastrou em ogestor360.com.{'\n'}
              Para cancelar o recebimento,{' '}
              <a href="https://ogestor360.com/cancelar" style={{ color: '#8B8B8B' }}>
                clique aqui
              </a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main:   React.CSSProperties = { backgroundColor: '#E8E6E1', fontFamily: "'DM Sans', Arial, sans-serif" }
const container: React.CSSProperties = { margin: '40px auto', maxWidth: '560px', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }
const header:  React.CSSProperties = { backgroundColor: '#1A1A1A', padding: '24px 32px' }
const logo:    React.CSSProperties = { fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: 0 }
const content: React.CSSProperties = { padding: '32px' }
const h1:      React.CSSProperties = { fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }
const p:       React.CSSProperties = { fontSize: '16px', lineHeight: '1.6', color: '#5A5A5A', marginBottom: '16px' }
const button:  React.CSSProperties = { backgroundColor: '#1F3F7A', color: '#FFFFFF', borderRadius: '8px', padding: '14px 24px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0 24px' }
const hr:      React.CSSProperties = { borderTop: '1px solid #D8D5CF', margin: '24px 0' }
const footer:  React.CSSProperties = { fontSize: '14px', color: '#8B8B8B', lineHeight: '1.6' }
const footerSection: React.CSSProperties = { backgroundColor: '#E8E6E1', padding: '20px 32px' }
const footerText:    React.CSSProperties = { fontSize: '12px', color: '#8B8B8B', lineHeight: '1.6', whiteSpace: 'pre-line' }
