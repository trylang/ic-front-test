import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ValidatorService {
  constructor(private appService: AppService) {}

  /**
   * 节流通用请求
   *
   * @param {Observable<string>} keys
   * @param {string} type
   * @returns
   * @memberof ValidatorService
   */
  public validateFn(keys: Observable<string>, type: string) {
    return keys.debounceTime(1000).distinctUntilChanged().switchMap((key: string) => this[type](key));
  }

  /**
   * 校验用户名是否存在
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public checkUsername(username: string): Observable<any> {
    const method = '/admin/checkUsername';
    return this.appService.GET(method, { username });
  }

  /**
   * 校验手机号是否存在
   *
   * @param {number} phone
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public checkPhone(phone: number): Observable<any> {
    const method = '/admin/checkPhone';
    return this.appService.GET(method, { phone });
  }

  /**
   * 重置密码_验证手机验证码
   *
   * @param {number} phone
   * @param {string} code
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  // public validateResetPwdAuthCode(phone: number, code: string): Observable<any> {
  //   const method = '/admin/validateResetPwdAuthCode';
  //   return this.appService.GET(method, { phone, code });
  // }

  /**
   * 用户注册，检测用户名是否重复
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public isExistName(username: string): Observable<any> {
    const method = '/account/isExistName';
    return this.appService.GET(method, { username });
  }

  /**
   * 用户检测——检验邮箱是否已被注册
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public isExistEmail(email: string): Observable<any> {
    const method = '/account/isExistEmail';
    return this.appService.GET(method, { email });
  }

  /**
   * 检测企业用户填写的审核企业是否已被注册
   *
   * @param {string} companyName
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public isClaimedbyEnter(companyName: string): Observable<any> {
    const method = '/enterpriseUser/isClaimedbyEnter';
    return this.appService.GET(method, { companyName });
  }

  /**
   * 园区名称是否已被注册
   *
   * @param {string} parkName
   * @returns {Observable<any>}
   * @memberof ValidatorService
   */
  public isClaimedbyPark(parkName: string): Observable<any> {
    const method = '/parkUser/isClaimedbyPark';
    return this.appService.GET(method, { parkName });
  }
}
