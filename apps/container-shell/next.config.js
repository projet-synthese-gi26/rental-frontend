/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pwa-easy-rental/shared-ui', '@pwa-easy-rental/shared-services'],
  async rewrites() {
    return [
      // MFE CLIENT
      {
        source: '/client',
        destination: 'http://localhost:3001/client',
      },
      {
        source: '/client/:path*',
        destination: 'http://localhost:3001/client/:path*',
      },
      // MFE AGENCY
      {
        source: '/agency',
        destination: 'http://localhost:3002/agency',
      },
      {
        source: '/agency/:path*',
        destination: 'http://localhost:3002/agency/:path*',
      },
      // MFE ORGANISATION
      {
        source: '/organisation',
        destination: 'http://localhost:3003/organisation',
      },
      {
        source: '/organisation/:path*',
        destination: 'http://localhost:3003/organisation/:path*',
      },
    ];
  },
};

module.exports = nextConfig;