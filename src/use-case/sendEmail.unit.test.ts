import * as sendTransactionalEmailModule from 'lib/brevo/sendTransactionalEmail';
import type { EmailDto, WebsiteDetails } from 'types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail, validateEmail } from './sendEmail';

// Mock the brevo library call
vi.mock('lib/brevo/sendTransactionalEmail', () => ({
  sendTransactionalEmail: vi.fn(),
}));

describe('use-case: sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should throw if emails do not match', () => {
      const emailDto = {
        email: 'test@example.com',
        verifyEmail: 'other@example.com',
      } as EmailDto;
      expect(() => validateEmail(emailDto)).toThrowError(
        'Email addresses do not match',
      );
    });

    it('should not throw if emails match', () => {
      const emailDto = {
        email: 'test@example.com',
        verifyEmail: 'test@example.com',
      } as EmailDto;
      expect(() => validateEmail(emailDto)).not.toThrow();
    });
  });

  describe('sendEmail', () => {
    it('should correctly format and send an email via Brevo', async () => {
      const emailDto: EmailDto = {
        name: 'Test User',
        email: 'test@example.com',
        verifyEmail: 'test@example.com',
        phone: '1234567890',
        body: 'Hello there',
        turnstileToken: 'token',
        dateSent: '2023-01-01',
      };

      const websiteDetails: WebsiteDetails = {
        websiteName: 'example.com',
        websiteOwnerName: 'Owner',
        language: 'en-GB',
        recipientEmail: 'owner@example.com',
        turnstileSecret: 'secret',
        timeZone: 'UTC',
      };

      const mockResponse = new Response(JSON.stringify({ messageId: '123' }));
      vi.mocked(
        sendTransactionalEmailModule.sendTransactionalEmail,
      ).mockResolvedValue(mockResponse);

      const result = await sendEmail(emailDto, websiteDetails, 'test-api-key');

      expect(
        sendTransactionalEmailModule.sendTransactionalEmail,
      ).toHaveBeenCalledTimes(1);

      const payload = vi.mocked(
        sendTransactionalEmailModule.sendTransactionalEmail,
      ).mock.calls[0][0];
      expect(payload.sender.email).toBe('no-reply@example.com');
      expect(payload.to[0].email).toBe('owner@example.com');
      expect(payload.replyTo?.email).toBe('test@example.com');
      expect(result).toBe(mockResponse);
    });
  });
});
