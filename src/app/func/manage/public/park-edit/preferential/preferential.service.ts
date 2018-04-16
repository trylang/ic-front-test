import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

import { Intro } from './intro.model';

@Injectable()
export class PreferentialService {
  constructor(
    private appService: AppService
  ) {}

  /**
   * 修改园区的介绍和政策
   *
   * @param {Intro} param
   * @returns {Observable<any>}
   * @memberof PreferentialService
   */
  public changeParkIntro(param: Intro): Observable<any> {
    const method = '/researcher/changeParkIntro';
    return this.appService.POST(method, param);
  }

  /**
   * 获取园区介绍
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof PreferentialService
   */
  public getIntroduction(md5: string): Observable<any> {
    const method = '/park/getIntroduction';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 获取园区优惠政策
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof PreferentialService
   */
  public getPreferential(md5: string): Observable<any> {
    const method = '/park/getPreferential';
    return this.appService.GET(method, { md5 });
  }
}
