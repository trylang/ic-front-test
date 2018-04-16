export class Basic {
  public md5?: string;
  public name: string;
  public level: string;
  public address: string;
  public type: string;
  public operator: string;
  public area: number;
  public logo: string;
  public industries: string[];
  public infrastructures: string[];

  constructor() {
    this.name = null;
    this.level = null;
    this.address = null;
    this.type = null;
    this.operator = null;
    this.area = null;
    this.logo = null;
    this.industries = [];
    this.infrastructures = [];
  }
}
