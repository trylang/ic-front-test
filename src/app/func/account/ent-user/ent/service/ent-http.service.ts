import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

@Injectable()
export class EntHttpServer {
  constructor(private appService: AppService) { }
  // sertype:请求类型 rooturl：请求路径 data：传入类json数据
  public FnEnts(sertype: string, rooturl: string, data?: any): Observable<any> {
    let option = null;
    if ( data ) {
      option = {
        industry: data.industry, // 行业
        address: data.address, // 地址
        province: data.province, // 地区
        contact: data.contact, // 联系人
        department: data.department, // 所属部门
        telephone: data.telephone, // 手机
        phone: data.phone, // 固定电话
        logo: data.logo, // 公司logo
        description: data.description, // 详细介绍
        pageNum: data.pageNum, // 页数
        status: data.status, // 状态
        time: data.time, // 时间排序
        name: data.name, // 按输入模糊查询
        mainProduct: data.mainProduct, // 主营产品
      };
    }
    return this.appService[sertype](rooturl, option);
  }
}
