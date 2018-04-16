export class ReqEnt {
  public lat: number;
  public lon: number;
  public page: number;
  public distance: number;
  public option: number;
  public date: number;
  public capital: number;
  public status: string;

  constructor() {
    this.lat = null;
    this.lon = null;
    this.page = 1;
    this.distance = null;
    this.option = 2;
    this.status = null;
    this.capital = null;
    this.date = null;
  }
}
