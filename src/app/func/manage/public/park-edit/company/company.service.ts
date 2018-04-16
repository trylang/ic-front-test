import { Injectable } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {
  constructor(
    private appService: AppService
  ) {}

  /**
   * 获取园区企业
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public getCompanies(md5: string, pageNum: number): Observable<any> {
    const method = '/park/getCompanies';
    return this.appService.GET(method, { md5, pageNum });
  }

  /**
   * 添加园区的入驻企业
   *
   * @param {string} md5
   * @param {string[]} companies
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public addParkCompanies(md5: string, companies: string[]): Observable<any> {
    const method = '/researcher/addParkCompanies';
    return this.appService.POST(method, { parkMd5: md5, companies });
  }

  /**
   * 修改入驻企业
   *
   * @param {string} id
   * @param {string} name
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public changeParkCompany(id: string, name: string): Observable<any> {
    const method = '/researcher/changeParkCompany';
    return this.appService.POST(method, { id, name });
  }

  /**
   * 删除入驻企业
   *
   * @param {string} id
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public deleteParkCompany(id: string): Observable<any> {
    const method = 'researcher/deleteParkCompany';
    return this.appService.GET(method, { id });
  }
}
