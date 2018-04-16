export class FormError {
	public email: string;
  public phone: string;
  public password: string;
  public confirmpsd: string;
  public passwordsGroup: {
  	password: string,
  	confirmpsd: string
  }

  constructor() {
  	this.email = null;
    this.phone = null;
    this.password = null;
    this.confirmpsd = null;
    this.passwordsGroup = {
    	password: null,
  	  confirmpsd: null
    };
  }
}
