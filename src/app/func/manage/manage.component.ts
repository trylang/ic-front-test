import { Component } from '@angular/core';
import { Account } from '../../account.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ManageService } from './manage.service';

@Component({
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {
  public isAdmin: boolean; // 判断是管理员还是研究员，确定显示相应的nav
  public account: Account;

  constructor( private router: Router, private titleService: Title, private manageService: ManageService) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('管理中心' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.account = JSON.parse(localStorage.getItem('account'));

    if (this.account && 5 === this.account.type) {
      this.isAdmin = true;
    } else if (2 === this.account.type) {
      this.isAdmin = false;
    } else {
      // 其它类型的用户都跳转到首页
      this.router.navigate(['/']);
    }
  }

  public logout() {
    this.manageService.logout().subscribe((data: any) => {
      if ('2000' === data.code) {
        localStorage.removeItem('account');
        this.router.navigate(['/']);
      }
    });
  }
}
