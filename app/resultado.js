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

function Empresa({ cnpj, empresa }) {
  const cnae = juntar([formatarCnae(empresa.cnae_fiscal), empresa.cnae_fiscal_descricao], ' – ')
  const endereco = juntar(
    [
      juntar([empresa.descricao_tipo_de_logradouro, empresa.logradouro], ' '),
      empresa.numero,
      empresa.complemento,
      empresa.bairro,
      juntar([empresa.municipio, empresa.uf], '/'),
      formatarCep(empresa.cep),
    ],
    ', ',
  )
  const socios = empresa.qsa ?? []

  const campos = [
    ['CNPJ', formatarCnpj(cnpj)],
    ['Razão social', empresa.razao_social],
    ['Nome fantasia', empresa.nome_fantasia],
    ['Situação cadastral', empresa.descricao_situacao_cadastral],
    ['Data de abertura', formatarData(empresa.data_inicio_atividade)],
    ['CNAE principal', cnae],
    ['Endereço', endereco],
    ['Porte', empresa.porte],
    ['Optante pelo Simples', simOuNao(empresa.opcao_pelo_simples)],
    ['Optante pelo MEI', simOuNao(empresa.opcao_pelo_mei)],
  ]

  return (
    <>
      <h2>Dados da empresa</h2>
      <dl>
        {campos.map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dt>{rotulo}</dt>
            <dd>{valor || NAO_INFORMADO}</dd>
          </div>
        ))}
      </dl>

      <h2>Quadro de sócios</h2>
      {socios.length === 0 ? (
        <p>Nenhum sócio informado para este CNPJ.</p>
      ) : (
        <ul>
          {socios.map((socio, indice) => (
            <li key={indice}>
              <strong>{socio.nome_socio}</strong>
              <br />
              {socio.qualificacao_socio || NAO_INFORMADO} · desde{' '}
              {formatarData(socio.data_entrada_sociedade)}
            </li>
          ))}
        </ul>
      )}

      <small>
        Dados fornecidos pela BrasilAPI, que podem estar defasados em relação à Receita
        Federal. Para uso oficial, confirme no comprovante emitido pela Receita.
      </small>
    </>
  )
}

export default function Resultado({ cnpj }) {
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    consultar(cnpj).then(setResultado)
  }, [cnpj])

  if (!resultado) return <p role="status">Consultando…</p>
  if (resultado.erro) return <p role="alert">{resultado.erro}</p>
  return <Empresa cnpj={cnpj} empresa={resultado.empresa} />
}
