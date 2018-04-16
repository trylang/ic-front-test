/**
 * 管理员查询参数
 * type 1-个人用户 2-研究员 5-管理员
 * @export
 * @class QueryParam
 */
export class QueryParam {
  public page: number;
  public key: string;
  public type: number;
  public sort: number;
  public stype: string; // key OR owner

  constructor() {
    this.page = 1;
    this.key = null;
    this.type = null;
    this.sort = 0;
    this.stype = 'key';
  }
}
