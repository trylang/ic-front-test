import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatentsDetailService } from '../service/patents-details.service';
import { detailsRec } from '../patents-data-type-model';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './patents-details.component.html',
  styleUrls: ['./patents-details.component.scss']
})
export class PatentsDetailsComponents implements OnInit, AfterViewInit {
  public detailsdata: any;
  public leisidata: any;
  public recdata: detailsRec;

  constructor(private router: Router, private route: ActivatedRoute, private detailserver: PatentsDetailService, private titleService: Title) {
    this.detailsdata = '';
    this.leisidata = '';
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.recdata = {
        key: params['key'],
        md5: params['md5']
      };
      this.gettabledata(this.recdata.md5 as string);
    });
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  public gettabledata(remoteMd5: string): void {
    this.detailserver.getDetail('/uc/getZhuanliDetail', remoteMd5).subscribe((data: any) => {
      if ('2000' === data.code) {
        const title = this.titleService.getTitle();
        this.detailsdata = data.data;
        if (data.data && data.data.mingcheng) {
          this.getleisidata([this.detailsdata.mingcheng.trim()], remoteMd5);
        }
        this.titleService.setTitle(this.detailsdata.mingcheng + '_专利详情' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }

  public getleisidata(keywords: string[], md5: string): void {
    this.detailserver.getDetail('/search/ic_patent/morelike', md5, keywords).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.leisidata = data.data;
      }
    });
  }
}
