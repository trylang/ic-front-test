import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';

@Injectable()
export class PatentsServer {
  constructor(private appService: AppService) { }
  // 搜索接口
  public patentsSearch(rooturl: string, data?: any) {
    let option = null;
    if (data) {
      option = {
        key: data.key || null, // 关键字
        page: data.page, // 页数
        dateRange: data.dateRange, // 申请时间段
        patentType: data.patentType, // 发明专利类型
        province: data.province, // 省份
        sort: data.sort, // 名字排序
        pubDate: data.pubDate, // 发布日期
        isTitle: data.isTitle, // 政策搜索分类
        option: data.option, // 动态地区,
        isFilter: data.isFilter
      };
    }
    return this.appService.POST(rooturl, option);
  }

  /**
   * 获取省份列表
   *
   * @returns {Observable<any>}
   * @memberof PatentsServer
   */
  public getProvince(): Observable<any> {
    const url = '/asset/localdb/ent.json';
    return this.appService.GetJSON(url);
  }
}
