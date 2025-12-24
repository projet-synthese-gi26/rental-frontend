const isProd = process.env.NODE_ENV === 'production';

export const MFE_URLS = {
  client: isProd ? 'https://client.ton-domaine.com' : 'http://localhost:3001/client',
  agency: isProd ? 'https://agency.ton-domaine.com' : 'http://localhost:3002/agency',
  organisation: isProd ? 'https://org.ton-domaine.com' : 'http://localhost:3003/organisation',
};