import * as getWebsiteDetailsModule from 'use-case/getWebsiteDetails';
import * as sendEmailModule from 'use-case/sendEmail';
import * as verifyTurnstileTokenModule from 'use-case/verifyTurnstileToken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendEmail } from './sendEmail';

vi.mock('use-case/getWebsiteDetails', () => ({
  getWebsiteDetails: vi.fn(),
}));

vi.mock('use-case/verifyTurnstileToken', () => ({
  verifyTurnstileToken: vi.fn(),
}));

vi.mock('use-case/sendEmail', () => ({
  validateEmail: vi.fn(),
  sendEmail: vi.fn(),
}));

describe('Endpoint: SendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if email validation fails', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockImplementation(() => {
      throw new Error('Email addresses do not match');
    });

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: { email: 'test@example.com' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const result = (await response.json()) as any;

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toBe('Email addresses do not match');
  });

  it('should return 400 if website name is not in URL path', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();

    const mockRequest = new Request('https://worker.dev/');
    const mockData = { body: {} };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const result = (await response.json()) as any;

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toBe('website name not provided');
  });

  it('should return 500 if turnstile check fails', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue(
      // biome-ignore lint/suspicious/noExplicitAny: mock
      {} as any,
    );
    vi.mocked(
      verifyTurnstileTokenModule.verifyTurnstileToken,
    ).mockResolvedValue(false);

    const mockRequest = new Request('https://worker.dev/example.com', {
      headers: new Headers({ 'CF-Connecting-IP': '127.0.0.1' }),
    });
    const mockData = { body: { turnstileToken: 'invalid' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const result = (await response.json()) as any;

    expect(response.status).toBe(500);
    expect(result.errors[0].message).toBe('failed robots check');
  });

  it('should return 500 if brevo fails to send email', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue(
      // biome-ignore lint/suspicious/noExplicitAny: mock
      {} as any,
    );
    vi.mocked(
      verifyTurnstileTokenModule.verifyTurnstileToken,
    ).mockResolvedValue(true);

    vi.mocked(sendEmailModule.sendEmail).mockResolvedValue({
      json: async () => ({}), // Missing messageId
      // biome-ignore lint/suspicious/noExplicitAny: mock
    } as any);

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: {} };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const result = (await response.json()) as any;

    expect(response.status).toBe(500);
    expect(result.errors[0].message).toBe(
      'email provider failed to send email',
    );
  });

  it('should return 200 on success', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue(
      // biome-ignore lint/suspicious/noExplicitAny: mock
      {} as any,
    );
    vi.mocked(
      verifyTurnstileTokenModule.verifyTurnstileToken,
    ).mockResolvedValue(true);

    vi.mocked(sendEmailModule.sendEmail).mockResolvedValue({
      json: async () => ({ messageId: '123' }),
      // biome-ignore lint/suspicious/noExplicitAny: mock
    } as any);

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: { email: 'test@example.com' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    // biome-ignore lint/suspicious/noExplicitAny: mock
    const result = (await response.json()) as any;

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.email.email).toBe('test@example.com');
  });
});
