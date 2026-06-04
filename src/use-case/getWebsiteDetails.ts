import type { WebsiteDetails } from 'types';

export const getWebsiteDetails = (
  env: Record<string, string>,
  websiteName: string,
): WebsiteDetails => {
  return <WebsiteDetails>JSON.parse(env[websiteName]);
};
