export class SearchParam {
  public key: string;
  public status: string;
  public option: number;
  public sort: number;
  public page: number;

  constructor() {
    this.key = null;
    this.status = null;
    this.page = 1;
    this.option = 1;
    this.sort = -1;
  }
}
