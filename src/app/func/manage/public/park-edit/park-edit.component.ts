import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import { SelectItem } from 'primeng/primeng';

import { Editor } from '../../../../tool/editor';

import { AppService } from '../../../../app.service';
import { ParkEditService } from './park-edit.service';
import { Account } from '../../../../account.model';

@Component({
  templateUrl: './park-edit.component.html',
  styleUrls: ['./park-edit.component.scss'],
  providers: [ParkEditService]
})
export class ParkEditComponent implements OnInit {
  public isAdmin: boolean;
  public parentRouter: string;
  public editorConf: object;
  public activeTab: number = 0;

  public md5: string;

  constructor(
    private appService: AppService,
    private parkEditService: ParkEditService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.isAdmin = (JSON.parse(localStorage.getItem('account')) as Account).type === 5 ? true : false;
    this.parentRouter = this.isAdmin ? '/manage/admin/park' : '/manage/researcher/park';

    this.editorConf = new Editor().config;
  }

  public ngOnInit() {
    // 用于新增园区基本信息之后，刷新路由，以及需要用到md5的属性
    this.route.queryParams.subscribe((params: Params) => {
      this.md5 = params['md5'];
      // this.intro.md5 = params['md5'];
    });

    // 首次进入页面初始化
    this.md5 = this.route.snapshot.queryParams['md5'] || null;
    if (this.md5) {
      // this.intro.md5 = this.md5;
    }
  }

  /**
   * Tab 切换
   *
   * @param {*} event
   * @memberof ParkEditComponent
   */
  public selectChange(event: any) {
    this.activeTab = event.index;
    switch (event.index) {
      case 1:
        // this.getIntroduction();
        // this.getPreferential();
        break;

      case 2:
        // this.getCompanies();
        break;

      case 3:
        // this.getServiceAdv();
        // this.getBrandAdv();
        break;

      case 4:
        // this.getProperties();
        break;

      case 0:
      default:
        // this.getBasic();
        break;
    }
  }
}
