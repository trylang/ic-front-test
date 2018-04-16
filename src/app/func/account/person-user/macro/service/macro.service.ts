import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../../../../app.service';

@Injectable()
export class MacroServer {
  constructor(
    private Server: AppService
  ) { }
  // sertype:请求类型 rooturl：请求路径 data：传入类json数据
  public FnMacros(sertype: string, rooturl: string, data?: any) {
    let option = null;
    if (data) {
      option = {
        parentId: data.parentId, // 父类ID
        keyword: data.keyword, // 搜索关键字
        pageNum: data.pageNum, // 页数
        baseId: data.baseId, // 数据ID
        region: data.region, // 地区
        freq: data.freq // 时间
      };
    }
    return this.Server[sertype](rooturl, option);
  }
}
