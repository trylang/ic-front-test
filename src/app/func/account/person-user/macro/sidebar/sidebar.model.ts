export class SideBarTree {
  public cascade: number;
  public id: number;
  public last: boolean;
  public name: string;
  public children?: SideBarTree[];
  public isActive?: boolean;
}
