import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from '@cloudflare/itty-router-openapi';
import { EmailDto, EmailDetails, BrevoResponse } from '../types';
import { sendEmail, validateEmail } from 'use-case/sendEmail';
import { getWebsiteDetails } from 'use-case/getWebsiteDetails';
import { verifyTurnstileToken } from 'use-case/verifyTurnstileToken';

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

    const { pathname } = new URL(request.url);
    const websiteName = pathname.split('/')[1];

    if (!websiteName) {
      return Response.json(
        {
          errors: [{ message: 'website name not provided' }],
          success: false,
          result: {},
        },
        { status: 400 }
      );
    }

    const websiteDetails = getWebsiteDetails(env, websiteName);

    try {
      const ip = request.headers.get('CF-Connecting-IP');
      const turnstileResult = await verifyTurnstileToken(
        websiteDetails,
        emailToSend.turnstileToken,
        ip
      );
      if (!turnstileResult) {
        throw new Error('failed robots check');
      }

      const brevoResponse = <BrevoResponse>(
        await (await sendEmail(emailToSend, websiteDetails)).json()
      );

      if (!brevoResponse.messageId) {
        throw new Error('email provider failed to send email');
      }

      return Response.json(
        {
          success: true,
          email: emailToSend,
        },
        { status: 200 }
      );
    } catch ({ message }) {
      return Response.json(
        {
          errors: [{ message }],
          success: false,
          result: {},
        },
        { status: 500 }
      );
    }
  }
}
