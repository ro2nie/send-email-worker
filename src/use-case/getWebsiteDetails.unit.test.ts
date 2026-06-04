import { describe, it, expect } from 'vitest';
import { getWebsiteDetails } from './getWebsiteDetails';
import { WebsiteDetails } from 'types';

describe('getWebsiteDetails', () => {
  it('should parse website details from environment correctly', () => {
    const mockWebsiteDetails: WebsiteDetails = {
      websiteName: 'example.com',
      language: 'en-GB',
      recipientEmail: 'owner@example.com',
      turnstileSecret: 'secret',
      websiteOwnerName: 'Owner',
      timeZone: 'UTC',
    };

    const env = {
      'example.com': JSON.stringify(mockWebsiteDetails),
    };

    const result = getWebsiteDetails(env, 'example.com');
    expect(result).toEqual(mockWebsiteDetails);
  });
});
