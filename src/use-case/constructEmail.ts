import { getEmailContent } from 'locale/emailLanguage';
import { sendTransactionalEmail } from 'lib/brevo/sendTransactionalEmail';
import { ContactBuilder } from 'lib/brevo/types/contact';
import { TransactionalEmailBodyBuilder } from 'lib/brevo/types/transactionalEmailBody';
import { Email } from 'types';

export const constructEmail = async (emailToSend: Email, env: any) => {
  return await sendTransactionalEmail(
    new TransactionalEmailBodyBuilder()
      .setSubject(env.websiteName ?? 'website')
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
      .build()
  );
};
