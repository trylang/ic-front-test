import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

@Injectable()
export class HeaderService {
  constructor(private appService: AppService) {}

  public logout(): Observable<any> {
    const method = 'account/logout';
    return this.appService.GET(method);
  }
}
