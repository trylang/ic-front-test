export class QueryParam {
  public page: number;
  public status: number;
  public key: string;
  public time: number;

  constructor() {
    this.page = 1;
    this.status = 0;
    this.key = null;
    this.time = 0;
  }
}
