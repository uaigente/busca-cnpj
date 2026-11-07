# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Página web de consulta de CNPJ, com dados da BrasilAPI (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`), hospedada na Vercel. O responsável é contador e está aprendendo a construir ferramentas com IA: explique em português simples. O código, os textos da interface e os nomes de variáveis são em português.

Restrições do projeto:
- Next.js na versão mais recente, com App Router e JavaScript (não TypeScript).
- O mínimo de código e de dependências. Hoje as únicas são `next`, `react` e `react-dom`, e o estilo é CSS puro em `app/globals.css`, sem biblioteca de UI.

## Comandos

```bash
npm run dev     # servidor de desenvolvimento
npm run build   # build de produção
npm start       # serve o build; use -- -p 3000 para escolher a porta
```

Não há testes automatizados nem linter configurados. Para validar, rode o build e confira a página em um navegador.

A documentação da versão instalada do Next.js fica em `node_modules/next/dist/docs/`. Consulte-a antes de usar APIs do framework.

## Arquitetura

- `app/page.js` (Server Component) lê `searchParams`, normaliza o CNPJ, valida o formato e renderiza a página inicial. O formulário é um `<form action="/">` comum, então cada consulta é um link compartilhável (`/?cnpj=...`) e carrega a página inteira.
- `app/resultado.js` (Client Component) consulta a API e exibe o resultado agrupado.
- `app/layout.js` contém a navbar, o rodapé e o script inline que aplica o tema antes da primeira pintura.
- `app/botao-tema.js` alterna o tema sem estado do React: grava `data-tema` no `<html>` e em `localStorage.tema`. O CSS troca as cores com `light-dark()` e `color-scheme`, e também decide qual ícone aparece.

## Regras que não são óbvias

- **A consulta à BrasilAPI precisa sair do navegador.** O firewall da API responde 403 a chamadas com o User-Agent padrão do Node, então ela não funciona em Server Components nem em Route Handlers. Não mude o User-Agent para contornar esse bloqueio: a decisão foi usar o navegador, que a API permite (CORS `*`, inclusive nas respostas de erro).
- **Não faça consultas automatizadas em volume à BrasilAPI.** O README da API pede volume compatível com o de uma pessoa real. Em testes, faça poucas consultas reais e simule o restante.
- **CNPJ alfanumérico:** a validação aceita letras nas 12 primeiras posições, e os 2 dígitos finais são numéricos. Não restrinja o campo a números.
- **`null` é diferente de `false`:** `opcao_pelo_simples` e `opcao_pelo_mei` podem vir `null`. Nesse caso, exiba "Não informado", nunca "Não".
- **`cnae_fiscal` vem como número** e perde o zero à esquerda. `formatarCnae` recompõe os 7 dígitos.
- **CPF dos sócios:** a API entrega o dado parcialmente oculto, e a decisão foi não exibi-lo.
- **Avisos ao usuário:** mantenha o aviso de possível defasagem dos dados e o rodapé dizendo que o site não é um serviço oficial da Receita Federal.
