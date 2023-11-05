import { TransactionalEmailBody } from './types/transactionalEmailBody';

const url = 'https://api.brevo.com/v3/smtp/email';

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
  transactionalEmailBody: TransactionalEmailBody
) => {
  const init = {
    body: JSON.stringify(transactionalEmailBody),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  };

  const response = await fetch(url, init);
  const results = await gatherResponse(response);
  return new Response(results, init);
};
