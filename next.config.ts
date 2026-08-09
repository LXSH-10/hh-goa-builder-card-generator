import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: blob: https://hebbkx1anhila5yf.public.blob.vercel-storage.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; connect-src 'self' https://hebbkx1anhila5yf.public.blob.vercel-storage.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
      ],
    }]
  },
}

export default nextConfig
