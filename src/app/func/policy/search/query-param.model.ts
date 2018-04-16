export class QueryParam {
  public isTitle: number;
  public pubDate: number;
  public province: string;
  public key: string;
  public page: number;

  constructor() {
    this.isTitle = 1;
    this.pubDate = null;
    this.province = null;
    this.key = null;
    this.page = 1;
  }
}
