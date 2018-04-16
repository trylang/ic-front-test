export class Morelike {
  public md5: string;
  public keywords: string[];

  constructor(md5: string, keywords: string[]) {
    this.md5 = md5;
    this.keywords = keywords;
  }
}
