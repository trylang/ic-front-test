export class QueryParam {
  public page: number;
  public key: string;
  public status: number;
  public time: number;

  constructor() {
    this.page = 1;
    this.key = null;
    this.status = 0;
    this.time = 0;
  }
}
