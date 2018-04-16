export class Case {
  public md5?: string;
  public name: string;
  public logo: string;
  public address: string;
  public startDate: number;
  public customerName: string;
  public companyMd5: string;
  public companyName?: string;
  public solutionId?: string;
  public detail: string;

  constructor() {
    this.name = null;
    this.logo = null;
    this.address = null;
    this.startDate = null;
    this.customerName = null;
    this.companyMd5 = null;
    this.companyName = null;
    this.solutionId = null;
    this.detail = null;
  }
}
