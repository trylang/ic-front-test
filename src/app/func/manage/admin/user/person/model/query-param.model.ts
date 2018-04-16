export class QueryParam {
  public page: number;
  public key: string;
  public sort: number;
  public type: number;

  constructor() {
    this.page = 1;
    this.key = null;
    this.sort = 0;
    this.type = null;
  }
}
