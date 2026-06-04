import type { WebsiteDetails } from 'types';

export const getWebsiteDetails = (
  env: Record<string, string>,
  websiteName: string,
): WebsiteDetails => {
  const websiteDetails = env[websiteName];

  if (!websiteDetails) {
    console.error('Error: Website details not found for website name', websiteName);
    throw new Error('Website details not found');
  }

  try {
    return <WebsiteDetails>JSON.parse(websiteDetails);
  } catch (err) {
    console.error('Error: Failed to parse website details, for website', websiteName);
    console.error(err);
    throw new Error('Failed to parse website details');
  }
};

