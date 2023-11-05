import { DateTime, Str } from '@cloudflare/itty-router-openapi';

export const Task = {
  name: new Str({ example: 'lorem' }),
  slug: String,
  description: new Str({ required: false }),
  completed: Boolean,
  due_date: new DateTime(),
};

export interface Email {
  name: string;
  email: string;
  body: string;
  dateSent: string;
}

export const EmailDetails = <Email>{
  name: new Str({ example: 'lorem', required: true }),
  email: new Str({ example: 'john.appleseed@example.com', required: true }),
  body: new Str({ required: true }),
};
