import { getEmailContent, getEmailSubject } from 'locale/emailLanguage';
import { sendTransactionalEmail } from 'lib/brevo/sendTransactionalEmail';
import { ContactBuilder } from 'lib/brevo/types/contact';
import { TransactionalEmailBodyBuilder } from 'lib/brevo/types/transactionalEmailBody';
import { EmailDto } from 'types';

export const sendEmail = async (
  emailToSend: EmailDto,
  env: any
): Promise<Response> => {
  return await sendTransactionalEmail(
    new TransactionalEmailBodyBuilder()
      .setSubject(getEmailSubject(env.websiteName)[env.language] ?? 'website')
      .setSender(
        new ContactBuilder()
          .setName(emailToSend.name)
          .setEmail(emailToSend.email)
          .build()
      )
      .setTo([
        new ContactBuilder()
          .setName(env.websiteOwnerName)
          .setEmail(env.recipientEmail)
          .build(),
      ])
      .setParams({
        websiteOwnerName: env.websiteOwnerName,
        customerName: emailToSend.name,
        customerEmailAddress: emailToSend.email,
        customerEmailBody: emailToSend.body,
      })
      .setHtmlContent(getEmailContent[env.language] ?? 'Error')
      .build(),
    env
  );
};

export const validateEmail = (emailToSend: EmailDto) => {
  if (emailToSend.email != emailToSend.verifyEmail) {
    throw new Error('Email addresses do not match');
  }
};
