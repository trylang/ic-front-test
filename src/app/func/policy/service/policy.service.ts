import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../../app.service';

@Injectable()
export class PolicyServer {
  constructor(private Server: AppService) { }
  // 搜索接口
  public policySearch(rooturl: string, data?: any) {
    return this.Server.POST(rooturl, {
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
    });
  }
}
