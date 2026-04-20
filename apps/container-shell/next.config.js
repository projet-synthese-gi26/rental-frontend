/** @type {import('next').NextConfig} */

const ORG_URL = process.env.NEXT_PUBLIC_ORG_URL || 'http://localhost:3003' ;
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL|| 'http://localhost:3001';
const AGENCY_URL = process.env.NEXT_PUBLIC_AGENCY_URL || 'http://localhost:3002';

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@pwa-easy-rental/shared-ui', '@pwa-easy-rental/shared-services'],
  async rewrites() {
    return [
      // MFE CLIENT
      {
        source: '/client',
        destination: `${CLIENT_URL}/client`,
      },
      {
        source: '/client/:path*',
        destination: `${CLIENT_URL}/client/:path*`,
      },
      
      // MFE AGENCY
      {
        source: '/agency',
        destination: `${AGENCY_URL}/agency`,
      },
      {
        source: '/agency/:path*',
        destination: `${AGENCY_URL}/agency/:path*`,
      },
      
      // MFE ORGANISATION
      {
        source: '/organisation',
        destination: `${ORG_URL}/organisation`,
      },
      {
        source: '/organisation/:path*',
        destination: `${ORG_URL}/organisation/:path*`,
      },
     
    ];
  },
};

module.exports = nextConfig;