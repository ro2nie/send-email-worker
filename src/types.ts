import { Email, Regex, Str } from '@cloudflare/itty-router-openapi';

export interface EmailDto {
  name: string;
  email: string;
  verifyEmail: string;
  phone: string;
  body: string;
  turnstileToken: string;
  dateSent: string;
}

export const EmailDetails = {
  // biome-ignore lint/suspicious/noExplicitAny: itty-router-openapi types are incomplete
  name: new Regex({ pattern: /^[\s\p{Letter}\p{Mark}]{2,20}$/gu } as any),
  email: new Email({ example: 'john.appleseed@example.com', required: true }),
  verifyEmail: new Email({
    example: 'john.appleseed@example.com',
    required: true,
  }),
  // biome-ignore lint/suspicious/noExplicitAny: itty-router-openapi types are incomplete
  phone: new Regex({ pattern: /^[-\d\s+]{4,20}$/ } as any),
  body: new Regex({
    pattern: /^[.:,?¿!¡\-_\d\s\p{Letter}\p{Mark}]{4,1000}$/gu,
    // biome-ignore lint/suspicious/noExplicitAny: itty-router-openapi types are incomplete
  } as any),
  turnstileToken: new Str({ example: 'abc123', required: false }),
};

export interface WebsiteDetails {
  websiteName: string;
  websiteOwnerName: string;
  recipientEmail: string;
  language: string;
  turnstileSecret: string;
  timeZone: string;
  brevo: string;
}

export interface SiteVerifyResponse {
  success: boolean;
  'error-codes': string[];
  challenge_ts: string;
  hostname: string;
}

export interface BrevoResponse {
  messageId: string;
}
