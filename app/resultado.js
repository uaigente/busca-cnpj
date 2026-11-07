'use client'

import { useEffect, useState } from 'react'

const NAO_INFORMADO = 'Não informado'

const ERROS = {
  400: 'CNPJ inválido. Confira o número digitado.',
  404: 'CNPJ não encontrado.',
  429: 'Muitas consultas em pouco tempo. Aguarde um instante e tente de novo.',
}
const ERRO_API = 'A consulta está indisponível no momento. Tente novamente mais tarde.'

// A consulta sai do navegador porque a BrasilAPI recusa chamadas feitas por servidores Node.
async function consultar(cnpj) {
  try {
    const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: AbortSignal.timeout(10000),
    })
    if (resposta.ok) return { empresa: await resposta.json() }
    return { erro: ERROS[resposta.status] ?? ERRO_API }
  } catch {
    return { erro: ERRO_API }
  }
}

const formatarCnpj = (cnpj) =>
  cnpj.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, '$1.$2.$3/$4-$5')

const formatarCep = (cep) =>
  cep ? String(cep).padStart(8, '0').replace(/^(\d{5})(\d{3})$/, '$1-$2') : ''

// A API devolve o CNAE como número, o que apaga o zero à esquerda (ex.: 0111301).
const formatarCnae = (cnae) =>
  cnae ? String(cnae).padStart(7, '0').replace(/^(\d{4})(\d)(\d{2})$/, '$1-$2/$3') : ''

const formatarData = (data) =>
  data ? data.split('-').reverse().join('/') : NAO_INFORMADO

// Vazio não é o mesmo que "não optante": a API pode não ter essa informação.
const simOuNao = (valor) =>
  valor === true ? 'Sim' : valor === false ? 'Não' : NAO_INFORMADO

const juntar = (partes, separador) => partes.filter(Boolean).join(separador)

function Campo({ rotulo, children }) {
  return (
    <div>
      <dt>{rotulo}</dt>
      <dd>{children || NAO_INFORMADO}</dd>
    </div>
  )
}

function Grupo({ titulo, className, children }) {
  return (
    <section className="cartao">
      <h3>{titulo}</h3>
      <dl className={className}>{children}</dl>
    </section>
  )
}

function Opcao({ valor }) {
  return <span className={`etiqueta ${valor === true ? 'positiva' : ''}`}>{simOuNao(valor)}</span>
}

function Empresa({ cnpj, empresa }) {
  const situacao = empresa.descricao_situacao_cadastral
  const socios = empresa.qsa ?? []

  return (
    <div className="resultado">
      <section className="cartao identificacao">
        <div>
          <h2>{empresa.razao_social || NAO_INFORMADO}</h2>
          <p>Nome fantasia: {empresa.nome_fantasia || NAO_INFORMADO}</p>
          <p>CNPJ: {formatarCnpj(cnpj)}</p>
        </div>
        <span className={`etiqueta ${situacao === 'ATIVA' ? 'positiva' : 'negativa'}`}>
          {situacao || NAO_INFORMADO}
        </span>
      </section>

      <div className="grade duas">
        <Grupo titulo="Atividade">
          <Campo rotulo="Data de abertura">{formatarData(empresa.data_inicio_atividade)}</Campo>
          <Campo rotulo="CNAE principal">
            {juntar([formatarCnae(empresa.cnae_fiscal), empresa.cnae_fiscal_descricao], ' – ')}
          </Campo>
        </Grupo>

        <Grupo titulo="Regime e porte">
          <Campo rotulo="Porte">{empresa.porte}</Campo>
          <Campo rotulo="Optante pelo Simples"><Opcao valor={empresa.opcao_pelo_simples} /></Campo>
          <Campo rotulo="Optante pelo MEI"><Opcao valor={empresa.opcao_pelo_mei} /></Campo>
        </Grupo>
      </div>

      <Grupo titulo="Endereço" className="colunas">
        <Campo rotulo="Logradouro">
          {juntar(
            [juntar([empresa.descricao_tipo_de_logradouro, empresa.logradouro], ' '), empresa.numero],
            ', ',
          )}
        </Campo>
        <Campo rotulo="Complemento">{empresa.complemento}</Campo>
        <Campo rotulo="Bairro">{empresa.bairro}</Campo>
        <Campo rotulo="Município/UF">{juntar([empresa.municipio, empresa.uf], '/')}</Campo>
        <Campo rotulo="CEP">{formatarCep(empresa.cep)}</Campo>
      </Grupo>

      <section className="cartao">
        <h3>Quadro de sócios ({socios.length})</h3>
        {socios.length === 0 ? (
          <p>Nenhum sócio informado para este CNPJ.</p>
        ) : (
          <ul className="socios">
            {socios.map((socio, indice) => (
              <li key={indice}>
                <span className="inicial" aria-hidden="true">{socio.nome_socio?.[0]}</span>
                <div>
                  <strong>{socio.nome_socio}</strong>
                  <p>
                    {socio.qualificacao_socio || NAO_INFORMADO} · desde{' '}
                    {formatarData(socio.data_entrada_sociedade)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="nota">
        Dados fornecidos pela BrasilAPI, que podem estar defasados em relação à Receita
        Federal. Para uso oficial, confirme no comprovante emitido pela Receita.
      </p>
    </div>
  )
}

export default function Resultado({ cnpj }) {
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    consultar(cnpj).then(setResultado)
  }, [cnpj])

  if (!resultado) return <p className="carregando" role="status">Consultando…</p>
  if (resultado.erro) return <p className="aviso-erro" role="alert">{resultado.erro}</p>
  return <Empresa cnpj={cnpj} empresa={resultado.empresa} />
}
