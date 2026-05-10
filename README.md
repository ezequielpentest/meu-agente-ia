# ⚡ Ezequiel Pentest Squad v3

## Estrutura do repositório

```
meu-agente-ia/
├── functions/
│   └── api/
│       └── claude.js   ← Proxy seguro para API Anthropic
├── public/
│   └── index.html      ← App completo
└── README.md
```

## Configurar API Key no Cloudflare

1. dash.cloudflare.com → Workers & Pages → meu-agente-ia
2. Settings → Environment variables
3. Add variable:
   - Nome: `ANTHROPIC_API_KEY`
   - Valor: sua chave `sk-ant-...`
   - Marcar como **Encrypted** ✓
4. Save → Redeploy

## Agentes

24 agentes especializados em pentest, red team, blue team e suporte a estudos.
