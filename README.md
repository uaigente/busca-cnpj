# Busca CNPJ

Página web gratuita para consultar os dados públicos de uma empresa pelo CNPJ. Não precisa de cadastro.

A pessoa digita o CNPJ e vê em uma só tela:

- razão social, nome fantasia e situação cadastral;
- data de abertura e CNAE principal;
- porte e opção pelo Simples e pelo MEI;
- endereço;
- quadro de sócios, com nome, qualificação e data de entrada.

O site também tem modo claro e escuro, funciona no celular e traz uma página "Como funciona" com dúvidas frequentes.

## Como usar

1. Abra a página inicial.
2. Digite ou cole o CNPJ, com ou sem pontos, barra e traço.
3. Clique em **Consultar**.

Cada consulta tem um link próprio, que pode ser salvo ou enviado a outra pessoa. Exemplo: `/?cnpj=00000000000191`.

O campo também aceita o novo CNPJ alfanumérico, com letras e números.

## Como rodar no seu computador

É preciso ter o [Node.js](https://nodejs.org) 20.9 ou mais recente.

```bash
git clone https://github.com/uaigente/busca-cnpj.git
cd busca-cnpj
npm install
npm run dev
```

Depois, abra http://localhost:3000 no navegador.

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o modo de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm start` | Roda a versão de produção (depois do `build`) |

O projeto não precisa de variáveis de ambiente nem de chave de API. Ele ainda não tem testes automatizados.

## Como publicar na Vercel

1. Na [Vercel](https://vercel.com), clique em **Add New → Project**.
2. Importe este repositório. Como ele é privado, a Vercel vai pedir acesso a ele.
3. Mantenha as configurações padrão e clique em **Deploy**.

Depois disso, cada alteração enviada ao ramo `main` gera uma nova publicação.

## Como o projeto funciona

O projeto usa [Next.js](https://nextjs.org) com App Router, em JavaScript, e tem como dependências apenas `next`, `react` e `react-dom`. O estilo é feito com CSS puro.

| Arquivo | Função |
|---|---|
| `app/page.js` | Página inicial: formulário e validação do CNPJ |
| `app/resultado.js` | Consulta a API e mostra os dados da empresa |
| `app/como-funciona/page.js` | Explicação do sistema e dúvidas frequentes |
| `app/layout.js` | Barra de navegação, rodapé e aplicação do tema |
| `app/botao-tema.js` | Botão de modo claro e escuro |
| `app/globals.css` | Estilos e cores dos dois temas |

**A consulta é feita pelo navegador, não pelo servidor.** O firewall da BrasilAPI recusa chamadas com a identificação padrão do Node.js, usada por servidores Next.js. O navegador é um caminho permitido pela API, e esse bloqueio não deve ser contornado.

## Fonte dos dados e limitações

Os dados vêm da [BrasilAPI](https://brasilapi.com.br), um serviço gratuito e comunitário.

- **Não é um serviço oficial.** Este site não tem ligação com a Receita Federal.
- **Os dados podem estar defasados.** A BrasilAPI não consulta a Receita em tempo real. Para uso oficial, confirme no comprovante emitido pela Receita.
- **"Não informado" é diferente de "Não".** Se o campo do Simples aparece como "Não informado", a fonte não trouxe esse dado, o que não significa que a empresa não seja optante.
- **O CPF dos sócios não é exibido.** A API só entrega esse dado parcialmente oculto.
- **Uso individual.** A BrasilAPI pede que o volume de consultas tenha a natureza de uma pessoa real. Não use este projeto para consultas automatizadas em massa.
