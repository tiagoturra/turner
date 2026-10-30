# Afinar

Landing page responsiva para um afinador de violão, desenvolvida em React, TypeScript, Vite e Tailwind CSS. A interface inclui uma demonstração interativa do afinador e alternância entre os temas claro e escuro.

## Quick Start

```bash
npm install
npm run dev
```

Abra a URL exibida pelo Vite no navegador. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

- `src/modules/tuner`: página e interface do afinador.
- `src/design-system`: componentes reutilizáveis.
- `src/i18n`: dicionários e configuração de traduções.
- `src/index.scss`: tokens globais de tema e diretivas Tailwind.
- `tailwind.config.js`: rastreamento dos arquivos com classes utilitárias.

## Variáveis de ambiente

Não há variáveis de ambiente necessárias nesta versão. Caso sejam introduzidas integrações no navegador, utilize apenas variáveis prefixadas com `VITE_APP_`; nunca inclua segredos no cliente.

## Notas de segurança

O deploy inclui cabeçalhos de proteção em `vercel.json`, incluindo CSP, `X-Frame-Options` e `X-Content-Type-Options`.
