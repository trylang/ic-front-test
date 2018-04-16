export class ParkUser {
  public username: string;
  public parkName: string;
  public address: string;
  public region: string;
  public operator: string;
  public contactPerson: string;
  public personDepartment: string;
  public contactPhone: string;
  public parkPhone: string;
  public license: string;
  public parkCertificateLogo: Array<{logo: string}>;
  public state?: number;


  constructor() {
    this.username = null;
    this.parkName = null;
    this.address = null;
    this.region = null;
    this.operator = null;
    this.contactPerson = null;
    this.personDepartment = null;
    this.contactPhone = null;
    this.parkPhone = null;
    this.license = null;
    this.parkCertificateLogo = [];
  }
}
