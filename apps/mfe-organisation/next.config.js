/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/organisation',
  trailingSlash: false,
  transpilePackages: ['@pwa-easy-rental/shared-ui', '@pwa-easy-rental/shared-services'],
  async rewrites() {
    return [
      {
        // On redirige tous les appels /api-rental vers le vrai serveur Render
        source: '/api-rental/:path*',
        destination: 'https://apirental5gi-v2.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;