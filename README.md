# ⚡ Ezequiel Pentest Squad — Deploy no Cloudflare Pages

Squad de 22 agentes IA especializados em pentest, hospedado no Cloudflare Pages com API key segura via Cloudflare Worker.

---

## 📁 Estrutura do Projeto

```
pentest-squad/
├── functions/
│   └── api/
│       └── claude.js        ← Worker: proxy seguro para a API Anthropic
├── src/
│   ├── main.jsx
│   └── App.jsx              ← O app principal com os 22 agentes
├── index.html
├── package.json
├── vite.config.js
├── wrangler.toml
├── .gitignore
└── .dev.vars                ← API key local (NÃO comitar)
```

---

## 🚀 Deploy Passo a Passo

### 1. Subir para o GitHub

```bash
# Na pasta do projeto:
git init
git add .
git commit -m "feat: ezequiel pentest squad v3.0"

# Criar repositório no GitHub (pode ser privado)
# Depois conectar:
git remote add origin https://github.com/SEU_USUARIO/pentest-squad.git
git push -u origin main
```

### 2. Conectar no Cloudflare Pages

1. Acesse **dash.cloudflare.com** → **Workers & Pages**
2. Clique em **Create** → **Pages** → **Connect to Git**
3. Selecione o repositório `pentest-squad`
4. Configure o build:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

### 3. Adicionar a API Key (IMPORTANTE)

Ainda na tela de configuração do Pages, antes de fazer o deploy:

1. Vá em **Settings → Environment Variables**
2. Clique em **Add variable**
3. Nome: `ANTHROPIC_API_KEY`
4. Valor: sua chave da Anthropic (`sk-ant-...`)
5. Marque como **Secret** (cadeado) ← importante!
6. Aplique para **Production** e **Preview**

### 4. Deploy!

Clique em **Save and Deploy**. Em ~2 minutos seu squad estará online em:
```
https://pentest-squad.pages.dev
```
(ou domínio customizado se você configurar)

---

## 🔧 Rodar Localmente

```bash
# Instalar dependências
npm install

# Instalar Wrangler (CLI do Cloudflare)
npm install -g wrangler

# Editar .dev.vars com sua API key real

# Rodar com suporte a Functions (proxy local)
npx wrangler pages dev dist --compatibility-date=2024-01-01

# Em outro terminal, buildar o React
npm run build
# Ou usar modo dev do Vite:
npm run dev
```

---

## 🔐 Segurança

- A `ANTHROPIC_API_KEY` **nunca** é exposta no frontend
- O arquivo `.dev.vars` está no `.gitignore`
- O Worker `/api/claude` funciona como proxy: o browser chama `/api/claude`, o Worker repassa para a Anthropic com a chave secreta

---

## 🌐 Domínio Customizado (opcional)

No painel do Cloudflare Pages → seu projeto → **Custom domains**:
- Adicione `squad.seudominio.com` (se você tiver um domínio na Cloudflare)
- O SSL é automático e gratuito
