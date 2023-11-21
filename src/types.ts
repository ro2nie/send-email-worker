import { Str, Email, Regex } from '@cloudflare/itty-router-openapi';

export interface EmailDto {
  name: string;
  email: string;
  verifyEmail: string;
  phone: string;
  body: string;
  turnstileToken: string;
  dateSent: string;
}

export const EmailDetails = <EmailDto>{
  name: new Regex({ pattern: /^[\s\p{Letter}\p{Mark}]{2,20}$/gu }),
  email: new Email({ example: 'john.appleseed@example.com', required: true }),
  verifyEmail: new Email({
    example: 'john.appleseed@example.com',
    required: true,
  }),
  phone: new Regex({ pattern: /^[\-\d\s+]{4,20}$/ }),
  body: new Regex({
    pattern: /^[.:,?¿!¡\-_\d\s\p{Letter}\p{Mark}]{4,1000}$/gu,
  }),
  turnstileToken: new Str({ example: 'abc123', required: false }),
};

export interface WebsiteDetails {
  websiteName: string;
  websiteOwnerName: string;
  recipientEmail: string;
  language: 'en-GB' | 'es-ES';
  turnstileSecret: string;
  timeZone: string;
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
