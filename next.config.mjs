/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      "font-src 'self' https://fonts.gstatic.com https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: data: https://res.cloudinary.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Bloqueia qualquer env var sem NEXT_PUBLIC_ de vazar para o cliente
  // Apenas estas são permitidas no bundle público:
  env: {},

  // Garante que Prisma não seja incluído no bundle do cliente
  serverExternalPackages: ['@prisma/client', 'prisma'],

};

export default nextConfig;
