const isProd = process.env.NODE_ENV === 'production';

const ORG_URL = process.env.NEXT_PUBLIC_MFE_ORGANISATION_URL ;
const CLIENT_URL = process.env.NEXT_PUBLIC_MFE_CLIENT_URL;
const AGENCY_URL = process.env.NEXT_PUBLIC_MFE_AGENCY_URL;


export const MFE_URLS = {
  client: isProd ? `${CLIENT_URL}/client` : 'http://localhost:3001/client',
  agency: isProd ? `${AGENCY_URL}/agency` : 'http://localhost:3002/agency',
  organisation: isProd ? `${ORG_URL}/organisation` : 'http://localhost:3003/organisation',
};