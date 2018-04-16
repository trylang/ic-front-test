import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

@Injectable()
export class AddCollectService {
  constructor(private appService: AppService) {}

  public addCollect(type: number, md5: string): Observable<any> {
    return this.appService.GET('/enterpriseUser/addCollection', { type, md5 });
  }

  public removeCollect(type: number, md5: string): Observable<any> {
    return this.appService.GET('/enterpriseUser/cancelCollection', { type, md5 });
  }

  public getCollectStatus(type: number, md5: string): Observable<any> {
    return this.appService.GET('/uc/isEntityCollected', { type, md5 });
  }

}
