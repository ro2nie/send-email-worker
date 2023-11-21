
import { TURNSTILE_VERIFY_URL } from 'finals';
import { SiteVerifyResponse, WebsiteDetails } from 'types';

export const verifyTurnstileToken = async (
  websiteDetails: WebsiteDetails,
  turnstileToken: string,
  ip: string
): Promise<boolean> => {
  const siteSecret = websiteDetails.turnstileSecret;

  if (!turnstileToken || !siteSecret) {
    return false;
  }

  const init = {
    body: JSON.stringify({
      secret: siteSecret,
      response: turnstileToken,
      remoteIp: ip,
    }),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  };

  const result = await fetch(TURNSTILE_VERIFY_URL, init);
  const outcome = <SiteVerifyResponse>await result.json();

  return outcome.success;
};
