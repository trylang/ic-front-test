import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';

@Injectable()
export class PolicyDetailService {
  constructor(private appService: AppService) { }

  public getDetail(rooturl: string, md5?: string, keywords?: string[]): Observable<any> {
    const method = rooturl;
    if (keywords) {
      return this.appService.POST(method, {
        md5: md5.trim(),
        keywords// 类似关键字
      });
    } else {
      return this.appService.GET(method, {
        md5
      });
    }
  }
}
