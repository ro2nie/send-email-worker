import { WebsiteDetails } from 'types';

export const getWebsiteDetails = (
  env: any,
  websiteName: string
): WebsiteDetails => {
  return <WebsiteDetails>JSON.parse(env[websiteName]);
};
