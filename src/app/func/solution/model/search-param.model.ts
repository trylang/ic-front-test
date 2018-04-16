export class SearchParam {
  public province: string;
  public industry: string;
  public function: string;
  public key: string;
  public sort: number;
  public page: number;
  public option: number;

  constructor() {
    this.province = null;
    this.industry = null;
    this.function = null;
    this.key = null;
    this.sort = -1;
    this.page = 1;
    this.option = 1;
  }
}
