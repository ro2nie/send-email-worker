import { BREVO_TRANSACTIONAL_EMAIL_URL } from 'finals';
import { TransactionalEmailBody } from './types/transactionalEmailBody';

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes('application/text')) {
    return response.text();
  } else if (contentType.includes('text/html')) {
    return response.text();
  } else {
    return response.text();
  }
}

export const sendTransactionalEmail = async (
  transactionalEmailBody: TransactionalEmailBody,
  env: any
): Promise<Response> => {
  const init = {
    body: JSON.stringify(transactionalEmailBody),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'api-key': env.brevo,
    },
  };
  const response = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, init);

  const results = await gatherResponse(response);
  return new Response(results, init);
};
