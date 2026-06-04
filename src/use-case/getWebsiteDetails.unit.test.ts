import type { WebsiteDetails } from 'types';
import { describe, expect, it } from 'vitest';
import { getWebsiteDetails } from './getWebsiteDetails';

describe('getWebsiteDetails', () => {
  it('should parse website details from environment correctly', () => {
    const mockWebsiteDetails: WebsiteDetails = {
      websiteName: 'example.com',
      language: 'en-GB',
      recipientEmail: 'owner@example.com',
      turnstileSecret: 'secret',
      websiteOwnerName: 'Owner',
      timeZone: 'UTC',
      brevo: 'brevo-api-key',
    };

    const env = {
      'example.com': JSON.stringify(mockWebsiteDetails),
    };

    const result = getWebsiteDetails(env, 'example.com');
    expect(result).toEqual(mockWebsiteDetails);
  });
});
