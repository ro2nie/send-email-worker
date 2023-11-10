import { Str, Email } from '@cloudflare/itty-router-openapi';

export interface EmailDto {
  name: string;
  email: string;
  verifyEmail: string;
  body: string;
  dateSent: string;
}

export const EmailDetails = <EmailDto>{
  name: new Str({ example: 'John Appleseed', required: true }),
  email: new Email({ example: 'john.appleseed@example.com', required: true }),
  verifyEmail: new Email({
    example: 'john.appleseed@example.com',
    required: true,
  }),
  body: new Str({ required: true }),
};

export interface WebsiteDetails {
  websiteName: string;
  websiteOwnerName: string;
  recipientEmail: string;
  language: 'en' | 'es';
}
