export class ParkRes {
  public username: string;
  public parkName?: string;
  public address: string;
  public region: string;
  public operator: string;
  public contactPerson: string;
  public personDepartment: string;
  public contactPhone: number;
  public parkPhone: string;
  public license: string;
  public leaseContract: string;
  public ownershipCertificate: string;
  public remark: string;
  public state: string;
  public parkCertificateLogo: any[];

  constructor() {
    this.address = null;
    this.contactPerson = null;
    this.parkPhone = null;
    this.leaseContract = null;
    this.license = null;
    this.contactPhone = null;
    this.operator = null;
    this.ownershipCertificate = null;
    this.parkName = null;
    this.personDepartment = null;
    this.region = null;
    this.remark = null;
    this.state = null;
    this.username = null;
    this.parkCertificateLogo = [];
  }
}
