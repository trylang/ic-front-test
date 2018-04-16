/**
 * status 0-all 1-researcher claimed 2-researcher not claimed
 * time 0-desc 1-asc
 * @export
 * @class QueryParam
 */
export class QueryParam {
  public page: number;
  public status: number;
  public time: number;
  public key: string;

  constructor() {
    this.key = null;
    this.page = 1;
    this.status = 0;
    this.time = 0;
  }
}
