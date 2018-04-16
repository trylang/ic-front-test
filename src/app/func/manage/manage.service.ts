import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../app.service';
@Injectable()
export class ManageService {
  constructor(private appService: AppService) {}

  /**
   * 研究员认领
   * status 0-企业， 1-方案， 2-案例， 3-产品
   *
   * @param {string} md5
   * @param {number} status
   * @returns {Observable<any>}
   * @memberof ManageService
   */
  public claimObject(md5: string, status: number): Observable<any> {
    const method = '/researcher/claimObject';
    return this.appService.GET(method, { md5, status });
  }

  /**
   * 研究员取消认领
   * status 0-企业， 1-方案， 2-案例， 3-产品
   *
   * @param {string} md5
   * @param {number} status
   * @returns {Observable<any>}
   * @memberof ManageService
   */
  public cancelClaimObject(md5: string, status: number): Observable<any> {
    const method = 'researcher/cancelClaimObject';
    return this.appService.GET(method, { md5, status });
  }

  public logout(): Observable<any> {
    const method = '/account/logout';
    return this.appService.GET(method);
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
    const method = '/user/uploadPicture';
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
