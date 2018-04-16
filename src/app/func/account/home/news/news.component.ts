import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import {HomeService} from '../home.service';

@Component({
  selector: 'ark-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public newsTable: any = {
    columnDefs: {
      show: true,
      data: [{
      label: '新闻标题',
      data: 'title',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: ( row: any) => {
        window.open(row.url);
      }
      },
      {
      label: '新闻来源',
      data: 'source',
      type: 'text',
      class: '',
      click: ''
      },
      {
        label: '发布时间',
        data: 'publishTime',
        type: 'date',
        class: '',
        click: ''
      }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };
  private parkMd5: string;
  private parkName: string;
  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute
  ) {
      this.route.queryParams.subscribe((params: Params) => {
      this.parkMd5 = params['md5'];
      this.parkName = params['name'];
    });
  }

  public ngOnInit() {
    this.getParkNewsList(this.parkMd5, 1);
  }

  // 获取园区舆情信息
  public getParkNewsList(md5: string, pageNum: number) {
    this.homeService.getParkNewsList(md5, pageNum).subscribe((res: any) => {
      if (res.code === '2000') {
        this.newsTable.columns = res.data;
        this.newsTable.page.size = res.size;
      }
    });
  }

  // 园区舆情分页
  public pageNewsNumber(page: any) {
    this.getParkNewsList(this.parkMd5, page);
  }
}
