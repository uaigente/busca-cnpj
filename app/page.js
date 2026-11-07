import Resultado from './resultado'

// O CNPJ alfanumérico tem 12 letras ou números, seguidos de 2 dígitos verificadores.
const FORMATO_CNPJ = /^[0-9A-Z]{12}[0-9]{2}$/

export default async function Page({ searchParams }) {
  const digitado = String((await searchParams).cnpj ?? '').trim()
  const cnpj = digitado.replace(/[^0-9a-z]/gi, '').toUpperCase()

  return (
    <main>
      <h1>Busca CNPJ</h1>

      <form action="/">
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

      {digitado &&
        (FORMATO_CNPJ.test(cnpj) ? (
          <Resultado cnpj={cnpj} />
        ) : (
          <p role="alert">CNPJ inválido. Confira o número digitado.</p>
        ))}
    </main>
  )
}
