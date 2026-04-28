# Gestor360® — Contratos de API

> Todas as rotas ficam em `src/app/api/`.
> Todas as rotas são Server-side (Next.js Route Handlers).
> Validação de entrada com **Zod** em todas as rotas.

---

## Índice

- [POST /api/leads](#post-apileads)
- [GET /api/ferramentas](#get-apiferramentas)
- [GET /api/ferramentas/[id]/download](#get-apiferramentsiddownload)
- [POST /api/leads/validar-codigo](#post-apileadsvalidar-codigo)
- [GET /api/pages/[slug]](#get-apipagesslug)

---

## POST /api/leads

**Arquivo:** `src/app/api/leads/route.ts`
**Acesso:** público (`anon`)
**Descrição:** salva um novo lead e dispara o e-mail de boas-vindas

### Request

```http
POST /api/leads
Content-Type: application/json
```

```typescript
// Body
{
  nome: string              // obrigatório, min 2 chars
  email: string             // obrigatório, formato email válido
  whatsapp?: string         // opcional, formato "(99) 99999-9999"
  capitulo_origem?: number  // 1–10. Se inválido, salva como null
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}
```

### Responses

**201 Created — sucesso**
```json
{
  "success": true,
  "message": "Cadastro realizado! Verifique seu e-mail.",
  "lead_id": "uuid"
}
```

**409 Conflict — e-mail já cadastrado**
```json
{
  "success": false,
  "code": "EMAIL_DUPLICATE",
  "message": "Este e-mail já está cadastrado. Verifique sua caixa de entrada."
}
```

**422 Unprocessable — dados inválidos**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "E-mail inválido",
    "nome": "Nome é obrigatório"
  }
}
```

**429 Too Many Requests — rate limit**
```json
{
  "success": false,
  "code": "RATE_LIMIT",
  "message": "Muitas tentativas. Aguarde alguns minutos."
}
```

### Lógica interna

```
1. Validar body com Zod
2. Verificar rate limit por IP (max 5 req/min)
3. Inserir no Supabase via service_role (bypassa RLS)
   - capitulo_origem: validar 1–10, senão null
   - metadata: { utm_source, utm_medium, utm_campaign, ip_hash }
4. Se UNIQUE violation (email) → retornar 409
5. Disparar e-mail via Resend (não bloquear a resposta — fire and forget)
6. Retornar 201
```

---

## GET /api/ferramentas

**Arquivo:** `src/app/api/ferramentas/route.ts`
**Acesso:** público (`anon`) — retorna apenas ferramentas gratuitas. Autenticado retorna todas.
**Descrição:** lista ferramentas por capítulo

### Request

```http
GET /api/ferramentas?capitulo=3
GET /api/ferramentas                  # todas
GET /api/ferramentas?capitulo=3&acesso=gratuito
```

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `capitulo` | number 1–10 | não | Filtrar por capítulo |
| `acesso` | `gratuito` \| `codigo_livro` | não | Filtrar por tipo de acesso |

### Response

**200 OK**
```json
{
  "ferramentas": [
    {
      "id": "uuid",
      "numero": 1,
      "nome": "GST — Guia de Sessão de Trabalho",
      "descricao": "Estruture qualquer reunião ou sessão estratégica.",
      "capitulo": 1,
      "acesso": "gratuito"
    }
  ],
  "total": 8
}
```

> **Nota:** `arquivo_path` **nunca é retornado** nesta rota. O download usa rota separada com autenticação.

---

## GET /api/ferramentas/[id]/download

**Arquivo:** `src/app/api/ferramentas/[id]/download/route.ts`
**Acesso:** requer lead cadastrado (validar pelo e-mail via cookie/token) ou admin autenticado
**Descrição:** gera signed URL temporária para download do PDF

### Request

```http
GET /api/ferramentas/uuid-da-ferramenta/download
Authorization: Bearer <lead_token>    # token gerado após cadastro
```

### Response

**200 OK**
```json
{
  "url": "https://storage.supabase.co/signed/...",
  "expires_at": "2026-04-28T16:00:00Z",
  "expires_in_seconds": 3600
}
```

**403 Forbidden — ferramenta requer código do livro**
```json
{
  "success": false,
  "code": "REQUIRES_BOOK_CODE",
  "message": "Esta ferramenta requer o código do livro. Insira seu código para desbloquear todas as 31 ferramentas."
}
```

**404 Not Found**
```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Ferramenta não encontrada."
}
```

### Lógica interna

```
1. Validar lead_token (JWT simples assinado com SUPABASE_SERVICE_ROLE_KEY)
2. Buscar ferramenta por ID
3. Se ferramenta.acesso = 'codigo_livro' AND lead.tem_codigo_livro = false → 403
4. Gerar signed URL via Supabase Storage SDK (expiração: 3600s)
5. Retornar URL — nunca o arquivo diretamente
```

---

## POST /api/leads/validar-codigo

**Arquivo:** `src/app/api/leads/validar-codigo/route.ts`
**Acesso:** requer lead_token
**Descrição:** valida o código impresso no livro e desbloqueia acesso completo

### Request

```http
POST /api/leads/validar-codigo
Content-Type: application/json
Authorization: Bearer <lead_token>
```

```json
{
  "codigo": "G360-XXXX-XXXX"
}
```

### Response

**200 OK — código válido**
```json
{
  "success": true,
  "message": "Código validado! Todas as 31 ferramentas foram desbloqueadas.",
  "ferramentas_desbloqueadas": 31
}
```

**400 Bad Request — código inválido**
```json
{
  "success": false,
  "code": "INVALID_CODE",
  "message": "Código incorreto. Verifique na página X do livro."
}
```

### Lógica interna

```
1. Validar lead_token
2. Comparar código com CODIGO_LIVRO_SECRET (variável de ambiente)
   - Comparação timing-safe para evitar timing attacks
3. Se válido: UPDATE leads SET tem_codigo_livro = true WHERE id = lead_id
4. Retornar sucesso
```

> **Segurança:** o código do livro nunca é comparado no frontend. 
> Todo o hash e validação é server-side.

---

## GET /api/pages/[slug]

**Arquivo:** `src/app/api/pages/[slug]/route.ts`
**Acesso:** público para páginas `published`. Admin lê rascunhos.
**Descrição:** retorna página com todas as seções para o renderizador CMS

### Request

```http
GET /api/pages/home
GET /api/pages/ferramentas
GET /api/pages/landing/lancamento-bh
```

### Response

**200 OK**
```json
{
  "page": {
    "id": "uuid",
    "slug": "ferramentas",
    "title": "Ferramentas do Gestor360®",
    "description": "Acesse as 31 ferramentas práticas do método.",
    "og_image": "https://...",
    "status": "published"
  },
  "sections": [
    {
      "id": "uuid",
      "type": "hero",
      "order_index": 0,
      "content": {
        "title": "Suas ferramentas estão aqui",
        "variant": "blue"
      },
      "visible": true
    },
    {
      "id": "uuid",
      "type": "form",
      "order_index": 1,
      "content": {
        "fields": [...]
      },
      "visible": true
    }
  ]
}
```

**404 Not Found**
```json
{
  "success": false,
  "code": "NOT_FOUND"
}
```

> **Nota:** Seções com `visible = false` são filtradas para usuários `anon`.
> Admins autenticados veem todas.

---

## Middleware de proteção

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rate limiting para /api/leads
  if (pathname === '/api/leads' && req.method === 'POST') {
    // implementar com Vercel KV ou headers de IP
  }

  // Proteção do painel admin
  if (pathname.startsWith('/admin')) {
    // verificar sessão Supabase
    // redirecionar para /login se não autenticado
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/leads', '/api/ferramentas/:path*/download'],
}
```

---

## Resumo dos endpoints

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/api/leads` | Público | Cadastrar novo lead |
| `GET` | `/api/ferramentas` | Público (gratuitas) / Auth (todas) | Listar ferramentas |
| `GET` | `/api/ferramentas/[id]/download` | Lead autenticado | Baixar PDF via signed URL |
| `POST` | `/api/leads/validar-codigo` | Lead autenticado | Validar código do livro |
| `GET` | `/api/pages/[slug]` | Público (published) / Admin (todas) | Buscar página com seções |

---

*Última atualização: Abril 2026 — DDM Editora*
*Referência: [`docs/PRD.md`](./PRD.md) · [`docs/cms-fields.md`](./cms-fields.md)*
