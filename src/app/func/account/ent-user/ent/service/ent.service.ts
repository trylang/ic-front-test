import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

import { EntParam, BasicParam } from '../model';

@Injectable()
export class EntServer {
  constructor(private appService: AppService) {}

  // sertype:请求类型 rooturl：请求路径 data：传入类json数据
  public FnEnts(sertype: string, rooturl: string, data?: any, isForm?: boolean) {
    let option = null;
    let Froms = null;
    if (data) {
      option = {
        productSupplierCategory: data.productSupplierCategory, // 产品供应商分类
        solutionSupplierCategory: data.solutionSupplierCategory, // 方案供应商分类
        address: data.address, // 地址
        region: data.region, // 地区
        contactPerson: data.contactPerson, // 联系人
        personDepartment: data.personDepartment, // 所属部门
        contactPhone: data.contactPhone, // 手机
        companyPhone: data.companyPhone, // 固定电话
        logo: data.logo, // 公司logo
        description: data.description, // 详细介绍
        mainProduct: data.mainProduct, // 主营产品
        pageNum: data.pageNum, // 页数
        status: data.status, // 状态
        time: data.time, // 时间排序
        name: data.name, // 按输入模糊查询
        type: data.type,
        md5: data.md5,
        username: data.username
      };
    }
    if (isForm) {
      Froms = { isFormSubmit: true };
    }
    return this.appService[sertype](rooturl, option, Froms);
  }

  /**
   * 保存企业资料
   *
   * @param {EntParam} param
   * @returns
   * @memberof EntServer
   */
  public saveEnterpriseVerify(param: EntParam) {
    const method = '/enterpriseUser/modifyCompanyInformation';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 获取企业资料
   *
   * @param {string} username
   * @returns
   * @memberof EntServer
   */
  public getEnterpriseVerify(username: string) {
    const method = '/enterpriseUser/getEnterpriseVerify';
    return this.appService.GET(method, {username});
  }

  /**
   * 获取企业基本信息
   *
   * @returns
   * @memberof EntServer
   */
  public getEntBasic() {
    const method = '/enterpriseUser/getRelatedEntityForCurrentUser';
    return this.appService.GET(method);
  }

  /**
   * 保存企业基本信息
   *
   * @param {BasicParam} param
   * @returns
   * @memberof EntServer
   */
  public saveEntBasic(param: BasicParam) {
    const method = '/enterpriseUser/modifyCompanyLIM';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 获取省份
   *
   * @returns
   * @memberof EntServer
   */
  public getRegion() {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }
}
