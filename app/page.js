import Resultado from './resultado'

// O CNPJ alfanumérico tem 12 letras ou números, seguidos de 2 dígitos verificadores.
const FORMATO_CNPJ = /^[0-9A-Z]{12}[0-9]{2}$/

const DESTAQUES = [
  ['Situação cadastral', 'Veja se a empresa está ativa e desde quando ela existe.'],
  ['Simples e MEI', 'Confira a opção pelo regime e o porte da empresa.'],
  ['Quadro de sócios', 'Saiba quem são os sócios e a qualificação de cada um.'],
]

export default async function Page({ searchParams }) {
  const digitado = String((await searchParams).cnpj ?? '').trim()
  const cnpj = digitado.replace(/[^0-9a-z]/gi, '').toUpperCase()

  return (
    <main>
      <section className={digitado ? 'hero compacto' : 'hero'}>
        {!digitado && (
          <>
            <p className="selo">Grátis e sem cadastro</p>
            <h1>
              Tudo sobre uma empresa, <span>a partir do CNPJ</span>
            </h1>
            <p className="subtitulo">
              Razão social, situação cadastral, CNAE, endereço, Simples, MEI e sócios
              reunidos em uma só tela.
            </p>
          </>
        )}

        <form action="/" className="busca">
          <label htmlFor="cnpj">CNPJ, com ou sem pontuação</label>
          <input
            id="cnpj"
            name="cnpj"
            defaultValue={digitado}
            placeholder="00.000.000/0001-91"
            autoComplete="off"
            required
          />
          <button type="submit">Consultar</button>
        </form>

        {!digitado && (
          <a className="exemplo" href="/?cnpj=00000000000191">
            Ver um exemplo de consulta →
          </a>
        )}
      </section>

      {!digitado && (
        <section className="grade tres" aria-label="O que você encontra">
          {DESTAQUES.map(([titulo, texto]) => (
            <div className="cartao" key={titulo}>
              <h2>{titulo}</h2>
              <p>{texto}</p>
            </div>
          ))}
        </section>
      )}

      {digitado &&
        (FORMATO_CNPJ.test(cnpj) ? (
          <Resultado cnpj={cnpj} />
        ) : (
          <p className="aviso-erro" role="alert">CNPJ inválido. Confira o número digitado.</p>
        ))}
    </main>
  )
}
