// 政策详情模块
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StandardDetailService } from '../service/standard-details.service';
import { detailsRec } from '../standard-data-type-model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ark-standard-details',
  templateUrl: './standard-details.component.html',
  styleUrls: ['./standard-details.component.scss']
})

export class StandardDetailsComponents implements OnInit, AfterViewInit {
  public detailsdata: any;
  public leisidata: any;
  public recdata: detailsRec;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private detailserver: StandardDetailService,
  ) {
    this.detailsdata = '';
    this.leisidata = '';
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.recdata = {
        md5: params['md5'],
        key: params['key'] || ''
      };
      this.gettabledata(this.recdata.md5 as string);
    });
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  public gettabledata(remoteMd5: string): void {
    this.detailserver.getDetail('/uc/getBiaozhunDetail', remoteMd5).subscribe((data: any) => {
      if ('2000' === data.code) {
        const title = this.titleService.getTitle();
        data.data.introduction = data.data.introduction.slice(5);
        this.detailsdata = data.data;

        this.getleisidata([this.detailsdata.name.trim()], remoteMd5);
        this.titleService.setTitle(this.detailsdata.name + '_标准详情' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }
  public getleisidata(keywords: string[], md5: string): void {
    this.detailserver.getDetail('/search/ic_standard/morelike', md5, keywords).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.leisidata = data.data;
      }
    });
  }
}
