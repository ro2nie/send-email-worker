import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from '@cloudflare/itty-router-openapi';
import { EmailDto, EmailDetails } from '../types';
import { sendTransactionalEmail } from 'lib/brevo/sendTransactionalEmail';
import { TransactionalEmailBodyBuilder } from 'lib/brevo/types/transactionalEmailBody';
import { ContactBuilder } from 'lib/brevo/types/contact';
import { sendEmail, validateEmail } from 'use-case/sendEmail';

export class SendEmail extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ['Send Email'],
    summary: 'Sends a new email',
    requestBody: EmailDetails,
    responses: {
      '200': {
        description: 'Returns the sent email',
        schema: {
          success: Boolean,
          result: {
            email: EmailDetails,
          },
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const emailToSend = <EmailDto>data.body;

    try {
      validateEmail(emailToSend);
    } catch (err) {
      return Response.json(
        {
          errors: [
            {
              validation: 'email',
              code: 'invalid_string',
              message: err.message,
              path: ['body', 'email '],
            },
          ],
          success: false,
          result: {},
        },
        { status: 400 }
      );
    }

    await sendEmail(emailToSend, env);

    return Response.json(
      {
        success: true,
        email: emailToSend,
      },
      { status: 200 }
    );
  }
}
