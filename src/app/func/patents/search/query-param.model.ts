export class QueryParam {
  public patentType: string;
  public dateRange: number;
  public province: string;
  public sort: number;
  public page: number;
  public key: string;

  constructor() {
    this.patentType = null;
    this.dateRange = null;
    this.province = null;
    this.sort = null;
    this.page = null;
    this.key = null;
  }
}
