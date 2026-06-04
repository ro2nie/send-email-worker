import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SendEmail } from './sendEmail';
import * as getWebsiteDetailsModule from 'use-case/getWebsiteDetails';
import * as verifyTurnstileTokenModule from 'use-case/verifyTurnstileToken';
import * as sendEmailModule from 'use-case/sendEmail';

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
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockImplementation(() => {
      throw new Error('Email addresses do not match');
    });

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: { email: 'test@example.com' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    const result = await response.json() as any;

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toBe('Email addresses do not match');
  });

  it('should return 400 if website name is not in URL path', async () => {
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();

    const mockRequest = new Request('https://worker.dev/');
    const mockData = { body: {} };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    const result = await response.json() as any;

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toBe('website name not provided');
  });

  it('should return 500 if turnstile check fails', async () => {
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue({} as any);
    vi.mocked(verifyTurnstileTokenModule.verifyTurnstileToken).mockResolvedValue(false);

    const mockRequest = new Request('https://worker.dev/example.com', {
      headers: new Headers({ 'CF-Connecting-IP': '127.0.0.1' }),
    });
    const mockData = { body: { turnstileToken: 'invalid' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    const result = await response.json() as any;

    expect(response.status).toBe(500);
    expect(result.errors[0].message).toBe('failed robots check');
  });

  it('should return 500 if brevo fails to send email', async () => {
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue({} as any);
    vi.mocked(verifyTurnstileTokenModule.verifyTurnstileToken).mockResolvedValue(true);
    
    vi.mocked(sendEmailModule.sendEmail).mockResolvedValue({
      json: async () => ({}), // Missing messageId
    } as any);

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: {} };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    const result = await response.json() as any;

    expect(response.status).toBe(500);
    expect(result.errors[0].message).toBe('email provider failed to send email');
  });

  it('should return 200 on success', async () => {
    const endpoint = new SendEmail({} as any);
    vi.mocked(sendEmailModule.validateEmail).mockReturnValue();
    vi.mocked(getWebsiteDetailsModule.getWebsiteDetails).mockReturnValue({} as any);
    vi.mocked(verifyTurnstileTokenModule.verifyTurnstileToken).mockResolvedValue(true);
    
    vi.mocked(sendEmailModule.sendEmail).mockResolvedValue({
      json: async () => ({ messageId: '123' }),
    } as any);

    const mockRequest = new Request('https://worker.dev/example.com');
    const mockData = { body: { email: 'test@example.com' } };

    const response = await endpoint.handle(mockRequest, {}, {}, mockData);
    const result = await response.json() as any;

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.email.email).toBe('test@example.com');
  });
});
