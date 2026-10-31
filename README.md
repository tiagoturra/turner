# Afinar

Landing page responsiva para um afinador de violão, desenvolvida em React, TypeScript, Vite e Tailwind CSS. Inclui afinação por microfone, tons contínuos de referência, temas claro/escuro e interface em português e inglês.

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
- `src/routes`: configuração central de rotas com React Router.
- `src/core/storage` e `src/core/url`: helpers tipados para cookies, storage e parâmetros de URL.
- `src/index.scss`: tokens globais de tema e diretivas Tailwind.
- `tailwind.config.js`: rastreamento dos arquivos com classes utilitárias.
- `postcss.config.js`: processamento das diretivas Tailwind.

## Recursos

- Detecção de frequência no navegador com Web Audio API e acesso explícito ao microfone.
- Nota, frequência e indicador de desvio em cents em tempo real.
- Estado de afinação preciso: ativo apenas entre `-1` e `+1 cent`.
- Botões para reproduzir continuamente as notas da afinação padrão (`E2`, `A2`, `D3`, `G3`, `B3`, `E4`); clique novamente para interromper o tom.
- Alternância entre modo claro e escuro.
- Menu de idiomas com `pt-BR` e `en-US`.

## Idiomas

Os idiomas disponíveis são definidos em `supportedLanguages` em `src/i18n/config.ts`. Para incluir um novo idioma, adicione seus dicionários em `src/i18n/locales/<código>/` e registre os recursos e a entrada correspondente nessa configuração.

## Microfone

O afinador solicita acesso ao microfone somente ao clicar em **Começar a afinar**. O áudio é processado localmente no navegador e não é enviado a um servidor.

O navegador exige um contexto seguro para liberar o microfone: use `localhost` durante o desenvolvimento ou HTTPS em produção.

## Variáveis de ambiente

Não há variáveis de ambiente necessárias nesta versão. Caso sejam introduzidas integrações no navegador, utilize apenas variáveis prefixadas com `VITE_APP_`; nunca inclua segredos no cliente.

## Rotas e helpers

As rotas de cliente usam `react-router-dom` e são declaradas em `src/routes/AppRoutes.tsx`. Operações repetidas de navegador ficam centralizadas em `src/core/`: `storage/browserStorage.ts` para dados não sensíveis, `storage/cookies.ts` para cookies de cliente e `url/params.ts` para parâmetros da URL. Não armazene tokens de autenticação nesses helpers; tokens duradouros devem ser cookies `HttpOnly` definidos pelo servidor.

## Notas de segurança

O deploy inclui cabeçalhos de proteção em `vercel.json`, incluindo CSP, `X-Frame-Options` e `X-Content-Type-Options`.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
