import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ParkService } from './park.service';
import { Info } from './park.model';
import { Account } from '../../../../account.model';
import { SnackBar } from '../../../../tool/snackbar';

@Component({
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.scss'],
  providers: [ParkService]
})
export class ParkComponent implements OnInit {
  private showType: string;
  private md5: string;
  private parkInfo: Info;
  private account: Account;
  private tabTitle: string = '园区资料';

  constructor(
    private parkService: ParkService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBar,
    private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('我的园区' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.parkInfo = new Info();
    const tab = {
      info: '园区资料',
      basic: '基本信息',
      preferential: '园区介绍及政策',
      company: '入驻企业',
      advantage: '园区优势',
      property: '物业'
    };
    this.route.queryParams.subscribe((params: Params) => {
      this.showType = params['type'];
      this.tabTitle = tab[params['type']];
    });

    this.md5 = localStorage.getItem('accountEntity') ? JSON.parse(localStorage.getItem('accountEntity')).md5 : null;
  }

  public ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('account'));
    this.getInfo();
  }

  private onSubmit() {
    this.saveInfo();
  }

  private getInfo() {
    this.parkService.getInfo(this.account.username).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.parkInfo = data.data;
      }
    });
  }

  private saveInfo() {
    this.parkService.saveInfo(this.parkInfo).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackBar.success('更新成功');
      }
    });
  }
}
