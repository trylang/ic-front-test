export class Product {
  public md5?: string;
  public name: string;
  public logo: string;
  public productCategory1: string;
  public productCategory2: string;
  public keywords: string;
  public companyId: string;
  public companyName: string;
  public solutionIds: string[];
  public summary: string;
  public detail: string;

  constructor() {
    this.name = null;
    this.logo = null;
    this.productCategory1 = null;
    this.productCategory2 = null;
    this.keywords = null;
    this.companyId = null;
    this.companyName = null;
    this.solutionIds = [];
    this.summary = null;
    this.detail = null;
  }
}
