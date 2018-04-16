export class QueryParam {
  public page: number;
  public key: string;
  public type: number;
  public sort: number;

  constructor() {
    this.page = 1;
    this.key = null;
    this.type = 3; // 3-企业 4-园区
    this.sort = 0;
  }
}
