/**
 * Account 账户的基本信息
 * type 1-个人普通用户，2-研究员，3-企业用户，4-园区用户，5-管理员
 * @export
 * @class Account
 */
export class Account {
  public username: string;
  public type: number;
  public typeName: string;
  public logo: string;
  public phone: number;
  public email: string;
  public roles: object[];
  public hasVerify?: boolean;
  public hasAudit?: boolean;

  constructor(
    username: string = null,
    type: number = null,
    typeName: string = null,
    logo: string = null,
    phone: number = null,
    email: string = null,
    roles: object[] = []
  ) {
    this.username = username;
    this.type = type;
    this.typeName = typeName;
    this.logo = logo;
    this.phone = phone;
    this.email = email;
    this.roles = roles;
  }
}
