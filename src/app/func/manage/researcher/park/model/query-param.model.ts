export class QueryParam {
  public page: number;
  public status: number;
  public sort: number;
  public key: string;

  constructor() {
    this.page = 1;
    this.status = 0;
    this.sort = 0;
    this.key = null;
  }
}
