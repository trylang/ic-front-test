export class EntParam {
  public companyName: string;
  public productSupplierCategory: string[];
  public solutionSupplierCategory: string[];
  public address: string;
  public region: string;
  public contactPerson: string;
  public personDepartment: string;
  public contactPhone: number;
  public companyPhone?: string;

  constructor() {
    this.companyName = null;
    this.productSupplierCategory = null;
    this.solutionSupplierCategory = null;
    this.address = null;
    this.region = null;
    this.contactPerson = null;
    this.personDepartment = null;
    this.contactPhone = null;
    this.companyPhone = null;
  }
}
