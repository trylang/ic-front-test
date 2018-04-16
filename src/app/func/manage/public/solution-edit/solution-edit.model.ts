export class Solution {
  public md5?: string;
  public name: string;
  public logo: string;
  public companyId: string;
  // public companyName?: string;
  public detail: string;
  public productIds: string[];
  public functionCategory: string;
  public industryCategory: string;
  public technologyCategories: Array<{ category1: string; category2: string[] }>;
  public productCategories: Array<{ category1: string; category2: string[] }>;

  constructor() {
    this.name = null;
    this.logo = null;
    this.companyId = null;
    // this.companyName = null;
    this.detail = null;
    this.productIds = [];
    this.functionCategory = null;
    this.industryCategory = null;
    this.technologyCategories = [];
    this.productCategories = [];
  }
}
