import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { Account } from '../../account.model';
import { AccountService } from './account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBar } from '../../tool/snackbar';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public headTitle: string;
  public urlPath: string;
  public account: Account;
  public entity: any; // 企业，园区基本信息
  private routerURL: {};

  constructor(
    private accountService: AccountService,
    private appService: AppService,
    private snackBar: SnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : new Account();
    this.headTitle = this.account.type === 3 ? '企业用户' : this.account.type === 1 ? '个人用户' : '园区用户';
    this.urlPath = this.account.type === 3 ? 'ent' : this.account.type === 1 ? 'person' : 'park';

    this.appService.accountAnnounced.subscribe((account: Account) => {
      this.account = account;
    });

    this.appService.accountEntityAnnounced.subscribe((entity: any) => {
      this.entity = entity;
    });

    this.routerURL = {
      home: {
        link: '/account/home',
        param: {type: this.account.type === 4 ? 'parkNews' : 'solution'}
      },
      homeEdit: '/account/home/edit',
      ent: {
        link: `/account/${this.urlPath}/ent/message`,
        param: {rootname: '企业资料'}
      },
      microAnalyze: `/account/${this.urlPath}/macro`,
      park: {
        link: '/account/park/owner',
        param: { type: 'info' }
      },
      parkAnalyze: '/account/park/analyze',
      collect: {
        link: '/account/collect',
        param: {type: 'solution'}
      },
      audit: `/account/${this.urlPath}/check`
    };
  }

  public ngOnInit(): void {
    if (this.account.type !== 1) {
      this.entityAction('get');
    }
  }

  /**
   * 获取企业园区基本信息
   *
   * @private
   * @memberof AccountComponent
   */
  private initEntityInfo() {
    this.accountService.getRelatedEntityForCurrentUser().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.entity = data.data;
        this.entityAction('save', data.data);
      }
    });
  }

  /**
   * 存储企业园区基本信息到localStorage
   *
   * @private
   * @param {*} data
   * @memberof AccountComponent
   */
  private entityAction(type: 'save' | 'get', data?: any) {
    const entity = localStorage.getItem('accountEntity') ? JSON.parse(localStorage.getItem('accountEntity')) : null;
    if (type === 'get') {
      if (entity) {
        this.entity = entity;
      } else {
        this.initEntityInfo();
      }
    } else if (type === 'save') {
      if (!entity) {
        localStorage.setItem('accountEntity', JSON.stringify(data));
      }
    } else {
      console.error('entityAction 参数传入错误');
    }
  }

  private validateHasAuth(type: string) {
    if (this.account.type === 1) {
      // 1.个人用户不需要审核
      if (typeof this.routerURL[type] === 'string') {
        this.router.navigate([this.routerURL[type]]);
      } else {
        this.router.navigate([this.routerURL[type]['link']], {
          queryParams: this.routerURL[type]['param']
        });
      }
    } else if (this.account.hasAudit || ((type === 'collect' || type === 'audit') && this.account.hasVerify)) {
      // 企业，园区用户需要邮箱验证，以及审核后才能继续访问，邮箱验证通过可以访问审核和收藏模块
      if (typeof this.routerURL[type] === 'string') {
        this.router.navigate([this.routerURL[type]]);
      } else {
        this.router.navigate([this.routerURL[type]['link']], {
          queryParams: this.routerURL[type]['param']
        });
      }
    } else {
      if (this.account.hasVerify) {
        this.snackBar.warning('请您先完成审核信息验证', '没有权限访问');
      } else {
        this.snackBar.warning('请您先完成邮箱验证', '没有权限访问');
      }
    }
  }
}
