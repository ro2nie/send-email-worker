export interface Contact {
  name: string;
  email: string;
}
export class ContactBuilder {
  public name: string;
  public email: string;

  public ContactBuilder(builder: ContactBuilder) {
    this.name = builder.name;
    this.email = builder.email;
  }

  public setName(name: string): ContactBuilder {
    this.name = name;
    return this;
  }

  public setEmail(email: string): ContactBuilder {
    this.email = email;
    return this;
  }

  public build(): Contact {
    return this;
  }
}
