import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

import { SnackBar } from './tool/snackbar';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackbar: SnackBar) {}

  /**
   * 处理请求，和返回值校验是否有 2001 - 未登录
   *
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof AppInterceptor
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });
    return next
      .handle(req)
      .do((event) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200 && event.type === 4) {
            // not login, session outdated code === '2001'
            if (event.body.code === '2001') {
              localStorage.removeItem('account');
              // 在需要登录授权的页面，应该跳转到首页或者登录页面
              this.router.navigate(['/login']);
            } else if (event.body.code === '3001') {
              this.snackbar.warning('您没有操作权限');
              this.router.navigate(['/']);
            } else if (event.body.code === '3010') { // 访问过速
              this.router.navigate(['/overspeed'], {
                queryParams: {
                  returnURL: this.router.routerState.snapshot.url
                }
              });
            } else if ('4004' === event.body.code) {
              this.snackbar.danger(event.body.message);
            } else if (/[2|3|4][\d]{3}/.test(event.body.code) && !/2003/.test(event.body.code) && !/2000/.test(event.body.code)) {
              // 2003 - 暂无数据
              this.snackbar.warning(event.body.message);
            }
          } else if (500 === event.status || 502 === event.status) {
            this.router.navigate(['/500']);
          }
        }
      })
      .catch(this.handleError);
  }

  public handleError(error: HttpErrorResponse | any) {
    console.error('请检查服务器连接配置，以及服务器状态', '服务器连接异常');
    return Observable.throw(error);
  }
}
