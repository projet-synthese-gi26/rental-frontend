/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  basePath: '/client',
  trailingSlash: false,
  transpilePackages: ['@pwa-easy-rental/shared-ui', '@pwa-easy-rental/shared-services'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // On redirige tous les appels /api-rental vers le vrai serveur Render
        source: '/client/api-rental/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        // basePath: false, // Important pour que le basePath ne soit pas ajouté à la destination
      },
    ];
  },
};

module.exports = nextConfig;