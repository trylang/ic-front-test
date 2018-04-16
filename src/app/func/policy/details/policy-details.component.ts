// 政策详情模块
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PolicyDetailService } from '../service/policy-details.service';
import { detailsRec } from '../policy-data-type-model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ark-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: [ './policy-details.component.scss']
})

export class PolicyDetailsComponents implements OnInit, AfterViewInit {
  public detailsdata: any;
  public leisidata: any;
  public recdata: detailsRec;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private detailserver: PolicyDetailService
  ) {
    this.detailsdata = '';
    this.leisidata = '';
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.recdata = {
        md5: this.route.queryParams['_value'].md5,
        key: this.route.queryParams['_value'].key
      };
      this.gettabledata(this.recdata.md5 as string);
    });
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  public gettabledata(remoteMd5: string): void {
    this.detailserver.getDetail('/uc/getZhengceDetail', remoteMd5).subscribe((data: any) => {
      if ('2000' === data.code) {
        const title = this.titleService.getTitle();
        this.detailsdata = data.data;
        this.getleisidata([this.detailsdata.title.trim()], remoteMd5);
        this.titleService.setTitle(this.detailsdata.title + '_政策详情' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }
  public getleisidata(keywords: string[], md5: string): void {
    this.detailserver.getDetail('/search/ic_policy/morelike', md5, keywords).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.leisidata = data.data;
      }
    });
  }
}
