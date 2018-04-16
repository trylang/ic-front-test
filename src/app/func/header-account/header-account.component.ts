import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Account } from '../../account.model';
import { HeaderAccountService } from './header-account.service';
import { AppService } from '../../app.service';

import { SnackBar } from '../../tool/snackbar';

@Component({
  selector: 'ark-header-account',
  templateUrl: './header-account.component.html',
  styleUrls: ['./header-account.component.scss'],
  providers: [HeaderAccountService]
})
export class HeaderAccountComponent {
  public account: Account;
  public accountEntity: any;

  constructor(
    private headerAccountService: HeaderAccountService,
    private router: Router,
    private snackbar: SnackBar,
    private route: ActivatedRoute,
    private localtion: Location,
    private appService: AppService
  ) {
    this.appService.accountAnnounced.subscribe((account: Account) => {
      this.account = account;
    });

    const storageAccount = localStorage.getItem('account');
    if (storageAccount) {
      this.account = JSON.parse(storageAccount);
    } else {
      this.account = new Account();
    }

    if (this.account.type === 3 || this.account.type === 4) {
      const entity = localStorage.getItem('accountEntity');
      if (entity) {
        this.accountEntity = JSON.parse(entity);
      }
    }
  }

  /**
   * 退出登录
   *
   * @memberof HeaderAccountComponent
   */
  private onLogout() {
    this.headerAccountService.logout().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('退出登录成功');
        // localStorage.removeItem('account');
        localStorage.clear(); // 退出清空所有存储值
        this.account = new Account();

        // 判断当前是否在管理中心或者用户中心等需要登录的页面，如果是需要重定向到首页
        const pattern = /^(\/manage\/|\/account\/)/;
        if (pattern.test(this.localtion.path())) {
          // Go to home page.
          this.router.navigate(['/']);
        }
      }
    });
  }

  /**
   * 重定向到账户设置页面
   *
   * @memberof HeaderAccountComponent
   */
  private redirectToSetting() {
    if (2 === this.account.type || 5 === this.account.type) {
      this.router.navigate(['/manage/public/info']);
    } else if (1 === this.account.type || 3 === this.account.type || 4 === this.account.type) {
      this.router.navigate(['/account/setting']);
    } else {
      // 其它类型的用户都跳转到首页
      this.router.navigate(['/']);
    }
  }
}
