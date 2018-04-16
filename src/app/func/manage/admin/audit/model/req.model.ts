export class Req {
  public page: number;
  public key: string;
  public state: number;
  public sort: number;

  constructor() {
    this.page = 1;
    this.key = null;
    this.state = null;
    this.sort = 0;
  }
}
