import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendTransactionalEmail } from './sendTransactionalEmail';
import type { TransactionalEmailBody } from './types/transactionalEmailBody';

const fetchSpy = vi.spyOn(globalThis, 'fetch');

describe('sendTransactionalEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send a transactional email and return a Response', async () => {
    const mockBody: TransactionalEmailBody = {
      sender: { name: 'Sender', email: 'sender@example.com', phone: '' },
      to: [{ name: 'To', email: 'to@example.com', phone: '' }],
      htmlContent: '<p>Test</p>',
      subject: 'Test Subject',
    };
    const mockEnv = { brevo: 'mock-api-key' };

    fetchSpy.mockResolvedValueOnce({
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ messageId: '12345' }),
      // biome-ignore lint/suspicious/noExplicitAny: mock
    } as any);

    const response = await sendTransactionalEmail(mockBody, mockEnv);
    const resultText = await response.text();

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      {
        body: JSON.stringify(mockBody),
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'api-key': 'mock-api-key',
        },
      },
    );
    expect(resultText).toBe(JSON.stringify({ messageId: '12345' }));
  });
});
