import './globals.css'

export const metadata = {
  title: 'Busca CNPJ',
  description: 'Consulte os dados públicos de uma empresa pelo CNPJ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
