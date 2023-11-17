import { Str, Email, Regex } from '@cloudflare/itty-router-openapi';

export interface EmailDto {
  name: string;
  email: string;
  verifyEmail: string;
  phone: string;
  body: string;
  dateSent: string;
}

export const EmailDetails = <EmailDto>{
  name: new Regex({ pattern: /^[\s\p{Letter}\p{Mark}]{2,20}$/gu }),
  email: new Email({ example: 'john.appleseed@example.com', required: true }),
  verifyEmail: new Email({
    example: 'john.appleseed@example.com',
    required: true,
  }),
  phone: new Regex({ pattern: /^[\d\s+]{4,20}$/ }),
  body: new Regex({ pattern: /^[\d\s\p{Letter}\p{Mark}]{4,1000}$/gu }),
};

export interface WebsiteDetails {
  websiteName: string;
  websiteOwnerName: string;
  recipientEmail: string;
  language: 'en-GB' | 'es-ES';
  timeZone: string;
}
