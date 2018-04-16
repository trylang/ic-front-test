import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Account } from '../../account.model';
import { SnackBar } from '../../tool/snackbar';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private account: Account;

  constructor(private router: Router, private snackBar: SnackBar) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.account = JSON.parse(localStorage.getItem('account')); // 登录信息

    if (this.account) {
      if (this.account.type === 3 || this.account.type === 4 || this.account.type === 1) {
        // only 个人，园区，企业 can success
        return true;
      } else {
        // not 个人，企业，园区, redirect to 404
        this.router.navigate(['/404']);
      }
    } else {
      // not login, redirect to login
      this.router.navigate(['/login']);
    }
    return false;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.account.type === 1) {
      return true; // 个人用户都可以访问
    } else {
      if (this.account.hasAudit) {
        return true; // 已通过审核
      } else {
        // 未通过审核
        if (this.account.hasVerify) {
          // 已验证邮箱未审核企业园区用户，可以访问收藏功能
          if (/^\/account\/collect\/*/.test(state.url)) {
            return true;
          } else {
            this.snackBar.warning('请您先完成审核信息验证', '没有权限');
            const router = this.account.type === 3 ? '/account/ent/check' : this.account.type === 4 ? '/account/park/check' : '/404';
            this.router.navigate([router]);
            return false;
          }
        } else {
          // 未通过邮箱认证
          this.snackBar.warning('请您先完成邮箱验证', '没有权限');
          this.router.navigate(['/account/setting']);
          return false;
        }
      }
    }
  }
}
