export class Req {
  public username: string;
  public companyName?: string;
  public parkName?: string;
  public state: number | string;
  public remark: string;

  constructor() {
    this.username = null;
    this.companyName = null;
    this.parkName = null;
    this.state = 0;
    this.remark = null;
  }
}
