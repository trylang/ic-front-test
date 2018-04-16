// 政策内容模块
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PolicyServer } from '../service/policy.service';
import { Title } from '@angular/platform-browser';

import { HeadList } from '../policy-data-type-model';
import { seaData } from '../policy-data-type-model';
import { QueryParam } from './query-param.model';

@Component({
  templateUrl: './policy-search.component.html',
  styleUrls: ['./policy-search.component.scss']
})
export class PolicySearchComponents implements OnInit {
  public headlist: HeadList[];
  public page: number;
  public recdata: any;
  public totalRecords: number;
  public currentPage: number = 1;
  public queryParam: QueryParam;

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private policyserver: PolicyServer) {
    this.recdata = '';
    const title = this.titleService.getTitle();
    this.titleService.setTitle('政策搜索' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.queryParam = new QueryParam();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.currentPage = +params['page'] || 1;
      this.queryParam.isTitle = +params['isTitle'] || 1;
      this.queryParam.page = +params['page'] || 1;
      this.queryParam.province = params['province'] || null;
      this.queryParam.pubDate = +params['pubDate'] || null;
      this.queryParam.key = params['key'] || null;

      this.Getdata({
        key: this.queryParam.key || '智能制造',
        page: this.currentPage,
        isTitle: this.queryParam.isTitle,
        pubDate: this.queryParam.pubDate,
        province: this.queryParam.province,
        sort: 1,
        option: 2
      });
    });

    this.headlist = [
      {
        title: '搜索类型',
        group: ['标题', '正文']
      },
      {
        title: '发布时间',
        group: ['一个月内', '三个月内', '半年内', '一年内']
      },
      {
        title: '适用地区',
        pdzhi: 1,
        group: ['全国', '上海', '浙江', '广东', '江苏']
      }
    ];
  }

  // 路由跳转
  public Getdata(data?: any): void {
    this.policyserver.policySearch('/search/ic_policy', data).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.recdata = data.data;
        this.totalRecords = this.recdata.size;
      }
    });
  }

  // 分页列表
  public paginate(paginator: any) {
    this.page = paginator.page + 1;
    this.currentPage = this.page;

    const queryParams = {
      key: this.queryParam.key,
      page: this.page,
      isTitle: this.queryParam.isTitle,
      pubDate: this.queryParam.pubDate,
      province: this.queryParam.province
    };

    this.router.navigate(['policy/search'], {
      queryParams
    });

    this.scrollTop();
  }

  private scrollTop() {
    window.scroll(0, 0);
  }
}
