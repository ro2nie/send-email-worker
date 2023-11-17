export interface Contact {
  name: string;
  email: string;
  phone: string;
}
export class ContactBuilder {
  public name: string;
  public email: string;
  public phone: string;

  public ContactBuilder(builder: ContactBuilder) {
    this.name = builder.name;
    this.email = builder.email;
    this.phone = builder.phone;
  }

  public setName(name: string): ContactBuilder {
    this.name = name;
    return this;
  }

  public setEmail(email: string): ContactBuilder {
    this.email = email;
    return this;
  }

  public setPhone(phone: string): ContactBuilder {
    this.phone = phone;
    return this;
  }

  public build(): Contact {
    return this;
  }
}
