import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // QR Codes do livro impresso — redireciona para o path correto preservando query string
      {
        source: '/livro/ferramentas',
        destination: '/ferramentas',
        permanent: true,
      },
      // Variações defensivas caso algum QR tenha path diferente
      {
        source: '/livro/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
