import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';

import { SnackBar } from '../../tool/snackbar';

import { HomeService } from './home.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  public productData: any;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private snackbar: SnackBar,
    private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('首页' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }

  public ngOnInit() {
    this.getProductData();
  }

  public onSearch(key: string) {
    if (key === null || key === 'undefined' || _.trim(key).length === 0) {
      this.snackbar.warning('请输入方案名称');
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { key : _.trim(key), sort: -1 },
        queryParamsHandling: 'merge'
      };
      this.router.navigate(['/solution/search'], navigationExtras);
    }
  }

  private getProductData() {
    this.homeService.getProductData().subscribe((data: any) => {
      this.productData = data;
    });
  }
}
