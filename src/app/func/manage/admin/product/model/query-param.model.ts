/**
 * type用户类型
 *
 * @export
 * @class QueryParam
 */
export class QueryParam {
  public page: number;
  public key: string;
  public type: number;
  public sort: number;
  public stype: string;

  constructor() {
    this.key = null;
    this.page = 1;
    this.sort = 0;
    this.type = null;
    this.stype = 'key';
  }
}
