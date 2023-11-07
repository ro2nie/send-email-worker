import { DateTime, Str, Email } from '@cloudflare/itty-router-openapi';

export const Task = {
  name: new Str({ example: 'lorem' }),
  slug: String,
  description: new Str({ required: false }),
  completed: Boolean,
  due_date: new DateTime(),
};

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
