export const metadata = { title: 'Como funciona | Busca CNPJ' }

const PASSOS = [
  ['Digite o CNPJ', 'Pode colar com ou sem pontos, barra e traço.'],
  ['Consultamos a BrasilAPI', 'Seu navegador busca os dados públicos da empresa.'],
  ['Veja tudo organizado', 'Os dados aparecem agrupados por assunto, e cada consulta tem um link próprio.'],
]

const DUVIDAS = [
  ['A consulta é paga?', 'Não. Você consulta de graça e sem criar conta.'],
  [
    'Os dados estão sempre atualizados?',
    'Nem sempre. A BrasilAPI não consulta a Receita Federal em tempo real, então pode haver defasagem. Para uso oficial, confirme no comprovante emitido pela Receita.',
  ],
  [
    'O que significa "Não informado"?',
    'Que a fonte não trouxe esse dado. Isso é diferente de "Não": um campo do Simples sem informação não quer dizer que a empresa não é optante.',
  ],
  ['Funciona com o CNPJ que tem letras?', 'Sim, o campo aceita o novo formato alfanumérico.'],
  [
    'Por que o CPF dos sócios não aparece?',
    'A fonte só entrega o CPF parcialmente oculto, então mostramos apenas o nome, a qualificação e a data de entrada.',
  ],
]

export default function ComoFunciona() {
  return (
    <main className="texto">
      <h1>Como funciona</h1>
      <p className="subtitulo">
        O Busca CNPJ reúne em uma tela os dados públicos de uma empresa: razão social, nome
        fantasia, situação cadastral, data de abertura, CNAE principal, endereço, porte,
        opção pelo Simples e MEI e quadro de sócios.
      </p>

      <ol className="grade tres passos">
        {PASSOS.map(([titulo, texto]) => (
          <li className="cartao" key={titulo}>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </li>
        ))}
      </ol>

      <h2 id="duvidas">Dúvidas frequentes</h2>
      {DUVIDAS.map(([pergunta, resposta]) => (
        <details className="cartao" key={pergunta}>
          <summary>{pergunta}</summary>
          <p>{resposta}</p>
        </details>
      ))}
    </main>
  )
}
