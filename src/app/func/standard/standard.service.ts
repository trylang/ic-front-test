import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { AppService } from '../../app.service';
import { SearchParam } from './model/search-param.model';
import { StandardContent } from './model/standard-search.model';

@Injectable()
export class StandardService {
  constructor(private appService: AppService) { }

  // 搜索接口
  public getStandardList(searchParam: SearchParam): Observable<any> {
    return this.appService.POST('/search/ic_standard', searchParam);
  }
}
