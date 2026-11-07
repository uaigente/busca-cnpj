import { Inter } from 'next/font/google'
import Link from 'next/link'
import BotaoTema from './botao-tema'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Busca CNPJ',
  description: 'Consulte grátis os dados públicos de qualquer empresa pelo CNPJ.',
}

// Roda antes da primeira pintura, para o tema escuro não "piscar" em branco.
const APLICAR_TEMA = `try {
  document.documentElement.dataset.tema = localStorage.tema ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro')
} catch {}`

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: APLICAR_TEMA }} />
      </head>
      <body>
        <header className="navbar">
          <Link href="/" className="marca">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            Busca CNPJ
          </Link>
          <nav aria-label="Menu principal">
            <Link href="/">Início</Link>
            <Link href="/como-funciona">Como funciona</Link>
            <Link href="/como-funciona#duvidas">Dúvidas</Link>
            <a href="https://brasilapi.com.br" target="_blank" rel="noreferrer">
              BrasilAPI
            </a>
          </nav>
          <BotaoTema />
        </header>

        {children}

        <footer>
          Dados públicos fornecidos pela BrasilAPI. Este site não é um serviço oficial da
          Receita Federal.
        </footer>
      </body>
    </html>
  )
}
