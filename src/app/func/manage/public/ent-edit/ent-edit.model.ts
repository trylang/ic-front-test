export class Ent {
  public md5?: string;
  public name: string;
  public logo: string;
  // public industry: string;
  public address: string;
  public province: string;
  public phone: string;
  public email: string;
  public website: string;
  public introduction: string;
  public mainProduct: string;
  public productSupplierCategory: string[];
  public solutionSupplierCategory: string[];

  constructor() {
    this.name = null;
    this.logo = null;
    // this.industry = null;
    this.address = null;
    this.province = null;
    this.phone = null;
    this.email = null;
    this.website = null;
    this.introduction = null;
    this.mainProduct = null;
    this.productSupplierCategory = [];
    this.solutionSupplierCategory = [];
  }
}
