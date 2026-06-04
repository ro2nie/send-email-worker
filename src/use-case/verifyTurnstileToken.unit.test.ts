import type { WebsiteDetails } from 'types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from './verifyTurnstileToken';

// Mock the globals
const fetchSpy = vi.spyOn(globalThis, 'fetch');

describe('verifyTurnstileToken', () => {
  const mockWebsiteDetails = {
    turnstileSecret: 'mock-secret',
  } as WebsiteDetails;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false if turnstileToken is empty', async () => {
    const result = await verifyTurnstileToken(
      mockWebsiteDetails,
      '',
      '127.0.0.1',
    );
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should return false if turnstileSecret is missing', async () => {
    const result = await verifyTurnstileToken(
      {} as WebsiteDetails,
      'token',
      '127.0.0.1',
    );
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should return true on successful verification', async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    } as Response);

    const result = await verifyTurnstileToken(
      mockWebsiteDetails,
      'valid-token',
      '127.0.0.1',
    );
    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.any(Object),
    );
  });

  it('should return false on failed verification', async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ success: false }),
    } as Response);

    const result = await verifyTurnstileToken(
      mockWebsiteDetails,
      'invalid-token',
      '127.0.0.1',
    );
    expect(result).toBe(false);
  });
});
