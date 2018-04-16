
// 返回方案列表实体类
export class SolutionList {

  public id: number;
  public md5: string;
  public name: string;
  public logo: string;
  public companyName: string;
  public industryCategory: string;
  public functionCategory: string;
  public technologyCategories: string[];
  public productCategories: string[];
  public address: string;

  constructor() {
    this.id = null;
    this.md5 = null;
    this.name = null;
    this.logo = null;
    this.companyName = null;
    this.industryCategory = null;
    this.functionCategory = null;
    this.technologyCategories = [];
    this.productCategories = [];
    this.address = null;
  }
}
