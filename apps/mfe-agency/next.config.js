/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  basePath: '/agency',
  trailingSlash: false,
  transpilePackages: ['@pwa-easy-rental/shared-ui', '@pwa-easy-rental/shared-services'],
  async rewrites() {
    return [
      {
        // On redirige tous les appels /api-rental vers le vrai serveur Render
        source: '/api-rental/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        basePath: false, // Important pour que le basePath ne soit pas ajouté à la destination
      },
    ];
  },
};

module.exports = nextConfig;