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
          .setPhone(emailToSend.phone)
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
        phoneNumber: emailToSend.phone,
        dateTime: new Date().toLocaleDateString(websiteDetails.language, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'longGeneric',
          timeZone: websiteDetails.timeZone,
        }),
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
