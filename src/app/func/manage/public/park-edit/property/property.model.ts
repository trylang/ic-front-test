export class Property {
  public id?: string;
  public description: string;
  public type: string;
  public logo: string;

  constructor() {
    this.description = null;
    this.type = null;
    this.logo = null;
  }
}
