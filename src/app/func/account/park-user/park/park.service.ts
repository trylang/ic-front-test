import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';
import { Info } from './park.model';

@Injectable()
export class ParkService {
  constructor(private appService: AppService) {}

  /**
   * 保存园区资料
   *
   * @param {Info} param
   * @returns {Observable<any>}
   * @memberof ParkService
   */
  public saveInfo(param: Info): Observable<any> {
    const method = '/parkUser/saveParkVerify';
    return this.appService.POST(method, param);
  }

  /**
   * 获取园区资料
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof ParkService
   */
  public getInfo(username: string): Observable<any> {
    const method = '/parkUser/getParkVerify';
    return this.appService.GET(method, {username});
  }
}
