import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';

import { ParkUser } from '../../model';

@Injectable()
export class CheckService {
    constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 获取省份
   *
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getProvinces(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }

  /**
   * 验证园区名称是否已存在
   *
   * @param {string} name
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public isExistParkName(parkName: string): Observable<any> {
    const url = '/parkUser/isClaimedbyPark';
    return this.appService.GET(url, {parkName});
  }

  /**
   * 获取当前用户园区审核信息
   * @param username
   */
  public getParkVerify(username: string): Observable<any> {
    const url = '/parkUser/getParkVerify';
    return this.appService.GET(url, {username});
  }

  /**
   * 保存(更新)园区用户审核信息
   *
   * @param {ParkUser} user
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public saveParkVerityResult(user: ParkUser): Observable<any> {
    const url = this.appService.baseURL + '/parkUser/saveParkVerify';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const param: ParkUser = {
      username: user.username,
      parkName: user.parkName,
      address: user.address,
      region: user.region,
      operator: user.operator,
      contactPerson: user.contactPerson,
      personDepartment: user.personDepartment,
      contactPhone: user.contactPhone,
      parkPhone: user.parkPhone,
      license: user.license,
      parkCertificateLogo: user.parkCertificateLogo,
      state: user.state
    };
    return this.http.post(url, JSON.stringify(param), {headers, withCredentials: true});
  }

  /**
   * 上传管理中心企业，方案，案例，产品，园区 - LOGO
   *
   * @param {string} dataURI
   * @param {string} fileName
   * @returns {Observable<any>}
   * @memberof ManageService
   */
  public saveImage(dataURI: string, fileName: string): Observable<any> {
    const method = '/user/uploadPicture?entity=verify';
    const fd = new FormData();
    fd.append('upload', this.dataURItoBlob(dataURI), fileName);
    return this.appService.POST(method, fd);
  }

  /**
   * transfer uri to blob
   *
   * @private
   * @param {*} dataURI
   * @returns
   * @memberof ManageService
   */
  private dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], {
      type: mimeString
    });
    return bb;
  }
}
