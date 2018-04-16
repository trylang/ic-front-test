export class EntUser {
  public username: string;
  public companyName: string;
  public address: string;
  public region: string;
  public productSupplierCategory: any[];
  public solutionSupplierCategory: any[];
  public contactPerson: string;
  public personDepartment: string;
  public contactPhone: string;
  public companyPhone: string;
  public license: string;
  public state?: number;


  constructor() {
    this.username = null;
    this.companyName = null;
    this.address = null;
    this.region = null;
    this.productSupplierCategory = [];
    this.solutionSupplierCategory = [];
    this.contactPerson = null;
    this.personDepartment = null;
    this.contactPhone = null;
    this.companyPhone = null;
    this.license = null;
  }
}
