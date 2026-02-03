const isProd = process.env.NODE_ENV === 'production';

export const MFE_URLS = {
  client: isProd ? 'https://pwa-easy-rental-mfe-client.vercel.app' : 'http://localhost:3001/client',
  agency: isProd ? 'https://pwa-easy-rental-agency.vercel.app' : 'http://localhost:3002/agency',
  organisation: isProd ? 'https://pwa-easy-rental-org.vercel.app' : 'http://localhost:3003/organisation',
};