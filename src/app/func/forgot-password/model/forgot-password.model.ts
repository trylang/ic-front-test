export class PersionPsdForm {
  public phone: string;
  public kaptcha: string;
  public password: string;
  public confirmpsd: string;
  public authCode: boolean;

  constructor() {
    this.phone = null;
    this.kaptcha = null;
    this.password = null;
    this.confirmpsd = null;
    this.authCode = null;
  }
}

export class SendEmailForm {
  public email: string;
  public kaptcha: string;

  constructor() {
    this.email = null;
    this.kaptcha = null;
  }
}

export class EntPsdForm {
  public key: string;
  public password: string;
  public confirmpsd: string;

  constructor() {
    this.key = null;
    this.password = null;
    this.confirmpsd = null;
  }
}

