export class QueryParam {
  public page: number;
  public key: string;
  public province: string;
  public level: string;
  public type: number;
  public sort: number;
  public stype: string;

  constructor() {
    this.key = null;
    this.page = 1;
    this.province = null;
    this.level = null;
    this.type = null;
    this.sort = 0;
    this.stype = null; // 搜索类型是操作人还是园区
  }
}
