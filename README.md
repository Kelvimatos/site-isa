# IM STORE — Beleza, Autocuidado & Acessórios

E-commerce moderno e responsivo desenvolvido com **HTML5 semântico**, **CSS3 modular (Design System & Composição 3D)** e **JavaScript Vanilla (ES6+)**, integrado ao **Supabase (BaaS)** para gerenciamento de catálogo e ao **WhatsApp Business** para checkout conversacional seguro.

---

## 💎 Sobre a IM Store

A **IM STORE** é um espaço fundado por Isabelly Matos criado para reunir beleza, autocuidado e bem-estar através de produtos selecionados: esfoliantes faciais e corporais, escovas de higienização profunda 2 em 1 e acessórios femininos.

O projeto adota uma arquitetura Jamstack estática de alto desempenho, com imagens 100% no formato moderno **WebP**, animações fluidas otimizadas por hardware, tipografia refinada e conformidade estrita com as diretrizes da **LGPD (Lei 13.709/2018)** e do **CDC (Lei 8.078/1990)**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - HTML5 semântico com acessibilidade nativa (WAI-ARIA).
  - CSS3 avançado (Custom Properties, Grid, Flexbox, animações por keyframes, compatibilidade cross-browser com prefixos).
  - JavaScript puro (ES6+ Vanilla), sem dependência de frameworks pesados no cliente.
  - Imagens de alta densidade compactadas em **WebP** com decodificação assíncrona e lazy loading.
  - Tipografia web: *Cormorant Garamond*, *Playfair Display* e *Plus Jakarta Sans* via Google Fonts com `font-display: swap`.
- **Backend & Armazenamento (BaaS):**
  - **Supabase** (PostgreSQL 15 com Row Level Security - RLS).
  - **GoTrue Auth** (autenticação segura baseada em JWT com controle de acesso RBAC via `app_metadata.is_admin`).
  - **Supabase Storage** (bucket público `product-images` com controle estrito de upload para administradores).
- **Checkout & Vendas:**
  - Checkout conversacional direto via WhatsApp Business (`https://wa.me/`).
  - Zero risco PCI-DSS (nenhum dado de cartão ou credencial bancária transita ou é armazenado no servidor).
- **Segurança & Servidor:**
  - Cabeçalhos HTTP estritos: Content Security Policy (CSP), Strict-Transport-Security (HSTS), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
  - Configurações prontas para **Vercel** (`vercel.json`), **Netlify/Cloudflare Pages** (`_headers`) e **Apache/cPanel** (`.htaccess`).
  - Arquivos de indexação e busca: `robots.txt` e `sitemap.xml`.

---

## 📋 Requisitos para Instalação

- [Node.js](https://nodejs.org/) versão 18.x ou superior (opcional, para execução de scripts de build e servidor local).
- Navegador moderno (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).
- Conta no [Supabase](https://supabase.com/) (caso deseje gerenciar produtos dinamicamente via painel administrativo).

---

## 🚀 Como Clonar e Executar Localmente

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/im-store.git
cd im-store
```

### 2. Configurar as Variáveis de Ambiente

Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` no seu editor e preencha suas configurações:

```env
# Supabase BaaS (Dashboard > Project Settings > API)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_aqui

# WhatsApp Oficial de Vendas (apenas dígitos: DDI + DDD + Número)
WHATSAPP_NUMBER=5511999999999
```

> **Nota de Segurança:** O arquivo `.env` e o arquivo gerado `assets/js/supabase-config.js` estão incluídos no `.gitignore` para garantir que credenciais locais nunca sejam expostas publicamente.

### 3. Gerar o Build de Configuração

Execute o comando de build para ler o `.env` e gerar a configuração do frontend:

```bash
npm run build
```

### 4. Iniciar o Servidor de Desenvolvimento

Para testar localmente com recarregamento:

```bash
npm run dev
```

Ou abra o arquivo `index.html` diretamente em seu navegador (ou via extensão *Live Server* do VS Code).

---

## 🗄️ Configuração do Banco de Dados (Supabase)

Para ativar o painel administrativo (`admin.html`) e o catálogo dinâmico:

1. No seu projeto Supabase, acesse **Project Settings → API** e copie:
   - **Project URL**
   - **Publishable Key (Anon Key)**
2. Acesse o **SQL Editor** do Supabase e execute o script contido em [`supabase/schema.sql`](./supabase/schema.sql). Ele criará:
   - A tabela `public.products` com políticas RLS (leitura pública para produtos ativos; escrita restrita a administradores).
   - O bucket de imagens `product-images` com proteção contra uploads não autorizados.
   - O catálogo inicial com os produtos e variações oficiais da loja.
3. Crie seu usuário administrador em **Authentication → Users**.
4. No **SQL Editor**, promova o usuário a administrador executando:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
   where email = 'seu-email-admin@exemplo.com';
   ```
5. **Recomendação de Segurança:** Em **Authentication → Providers → Email**, desative a opção **"Enable Signups"** para impedir novos cadastros públicos.

---

## 🌐 Configuração na Hospedagem (Produção)

### Vercel / Netlify / Cloudflare Pages

1. Importe o repositório na plataforma de hospedagem.
2. Nas configurações do projeto (**Settings → Environment Variables**), cadastre as variáveis:
   - `SUPABASE_URL`: URL do seu projeto Supabase.
   - `SUPABASE_PUBLISHABLE_KEY`: Chave pública do Supabase.
   - `WHATSAPP_NUMBER`: Número oficial com DDI e DDD (ex: `5511986216603`).
3. Defina o **Build Command** como:
   ```bash
   npm run build
   ```
4. Defina o **Output Directory** como a raiz (`.` ou `./`).
5. As regras de cabeçalhos de segurança serão aplicadas automaticamente a partir de `vercel.json` ou `_headers`.

### Servidores Tradicionais (Apache, cPanel, Hostinger, Locaweb)

1. Execute `npm run build` localmente com seu `.env` preenchido.
2. Faça o upload de todos os arquivos do projeto (incluindo `.htaccess` e a pasta `assets/`).
3. O arquivo `.htaccess` garantirá a imposição de HTTPS, cabeçalhos de proteção (HSTS, CSP, X-Frame-Options) e o roteamento correto da página `404.html`.

---

## 🔒 Diretrizes de Segurança

- **Chaves Privadas:** NUNCA utilize chaves `service_role` ou senhas de banco de dados no frontend.
- **XSS & Injeção:** A manipulação de DOM é realizada estritamente com `textContent`, `createElement` e `replaceChildren`.
- **Integridade de Preços:** O checkout calcula e valida os subtotais a partir do catálogo oficial, prevenindo adulteração client-side.
- **Git Hygiene:** O arquivo `.gitignore` bloqueia logs, arquivos `.env`, chaves `.pem`, dumps e artefatos de build.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para obter detalhes.
