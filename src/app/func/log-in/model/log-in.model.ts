export class LogInForm {
  public authentication: string;
  public password: string;
  public remember: boolean;

  constructor() {
    this.authentication = null;
    this.password = null;
    this.remember = null;
  }
}
