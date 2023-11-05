import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from '@cloudflare/itty-router-openapi';
import { Email, EmailDetails } from '../types';
import { sendTransactionalEmail } from 'lib/brevo/sendTransactionalEmail';
import { TransactionalEmailBodyBuilder } from 'lib/brevo/types/transactionalEmailBody';
import { ContactBuilder } from 'lib/brevo/types/contact';

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
            task: EmailDetails,
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
    // Retrieve the validated request body

    const emailToSend = <Email>data.body;

    // Implement your own object insertion here

    
    /** 
	 
	  
	 */

    // return the new task
    return {
      success: true,
      email: emailToSend,
    };
  }
}
