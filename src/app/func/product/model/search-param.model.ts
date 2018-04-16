export class SearchParam {
  public key: string;
  public cat1: string;
  public cat2: string;
  public sort: number;
  public page: number;
  public option: number;

  constructor() {
    this.key = null;
    this.cat1 = null;
    this.cat2 = null;
    this.sort = -1;
    this.page = 1;
    this.option = 1;
  }
}
