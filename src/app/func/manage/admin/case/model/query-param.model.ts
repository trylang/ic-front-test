export class QueryParam {
  public page: number;
  public key: string;
  public type: number;
  public sort: number;
  public stype: string;

  constructor() {
    this.page = 1;
    this.key = null;
    this.type = null;
    this.sort = 0;
    this.stype = null;
  }
}
