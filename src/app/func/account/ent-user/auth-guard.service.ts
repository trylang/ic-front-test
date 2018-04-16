import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Account } from '../../../account.model';
import { SnackBar } from '../../../tool/snackbar';

@Injectable()
export class AuthGuard implements CanActivate {
  private account: Account;

  constructor(private router: Router, private snackBar: SnackBar) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    this.account = JSON.parse(localStorage.getItem('account')); // 登录信息

    if (this.account) {
      if (this.account.type === 3) {
        if (this.account.hasVerify) {
          if (this.account.hasAudit) {
            return true; // 通过审核
          } else {
            if (/^\/account\/ent\/check/.test(state.url)) {
              return true;
            } else {
              this.snackBar.warning('请您先完成审核信息验证', '没有权限');
              const router = '/account/ent/check';
              this.router.navigate([router]);
              return false; // 未通过审核
            }
          }
        } else {
          this.snackBar.warning('请您先完成邮箱验证', '没有权限');
          this.router.navigate(['/account/setting']);
          return false;
        }
      } else {
        this.router.navigate(['/404']);
      }
    } else {
      // not login, redirect to login
      this.router.navigate(['/login']);
    }
    return false;
  }
}
