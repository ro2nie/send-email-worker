import { getEmailContent, getEmailSubject } from 'locale/emailLanguage';
import { sendTransactionalEmail } from 'lib/brevo/sendTransactionalEmail';
import { ContactBuilder } from 'lib/brevo/types/contact';
import { TransactionalEmailBodyBuilder } from 'lib/brevo/types/transactionalEmailBody';
import { EmailDto, WebsiteDetails } from 'types';

export const sendEmail = async (
  emailToSend: EmailDto,
  websiteDetails: WebsiteDetails
): Promise<Response> => {
  return await sendTransactionalEmail(
    new TransactionalEmailBodyBuilder()
      .setSubject(
        getEmailSubject(websiteDetails.websiteName)[websiteDetails.language] ??
          'website'
      )
      .setSender(
        new ContactBuilder()
          .setName(emailToSend.name)
          .setEmail(emailToSend.email)
          .build()
      )
      .setTo([
        new ContactBuilder()
          .setName(websiteDetails.websiteOwnerName)
          .setEmail(websiteDetails.recipientEmail)
          .build(),
      ])
      .setParams({
        websiteOwnerName: websiteDetails.websiteOwnerName,
        customerName: emailToSend.name,
        customerEmailAddress: emailToSend.email,
        customerEmailBody: emailToSend.body,
      })
      .setHtmlContent(getEmailContent[websiteDetails.language] ?? 'Error')
      .build(),
    websiteDetails
  );
};

export const validateEmail = (emailToSend: EmailDto) => {
  if (emailToSend.email != emailToSend.verifyEmail) {
    throw new Error('Email addresses do not match');
  }
};
