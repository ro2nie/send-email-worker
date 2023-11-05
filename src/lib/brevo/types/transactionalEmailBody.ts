import { Contact } from './contact';
import { Parameters } from './parameters';

export interface TransactionalEmailBody {
  subject: string;
  sender: Contact;
  to: Contact[];
  replyTo?: Contact;
  params?: Parameters;
  htmlContent: string;
  scheduledAt?: string; //'2023-11-05T22:13:01.999Z';
}

export class TransactionalEmailBodyBuilder {
  public subject: string;
  public sender: Contact;
  public to: Contact[];
  public replyTo?: Contact;
  public params?: Parameters;
  public htmlContent: string;
  public scheduledAt?: string;

  public TransactionalEmailBodyBuilder(builder: TransactionalEmailBodyBuilder) {
    this.subject = builder.subject;
    this.sender = builder.sender;
    this.to = builder.to;
    this.replyTo = builder.replyTo;
    this.params = builder.params;
    this.htmlContent = builder.htmlContent;
    this.scheduledAt = builder.scheduledAt;
  }

  public setSubject(subject: string): TransactionalEmailBodyBuilder {
    this.subject = subject;
    return this;
  }

  public setSender(sender: Contact): TransactionalEmailBodyBuilder {
    this.sender = sender;
    return this;
  }

  public setTo(to: Contact[]): TransactionalEmailBodyBuilder {
    this.to = to;
    return this;
  }

  public setReplyTo(): TransactionalEmailBodyBuilder {
    this.replyTo = this.sender;
    return this;
  }

  public setParams(params: Parameters): TransactionalEmailBodyBuilder {
    this.params = params;
    return this;
  }

  public setHtmlContent(htmlContent: string): TransactionalEmailBodyBuilder {
    this.htmlContent = htmlContent;
    return this;
  }

  public setScheduledAt(scheduledAt: string): TransactionalEmailBodyBuilder {
    this.scheduledAt = scheduledAt;
    return this;
  }

  public build(): TransactionalEmailBody {
    return this;
  }
}
