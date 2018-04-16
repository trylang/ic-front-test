// 标准内容模块
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeadList } from '../standard-data-type-model';
import { seaData } from '../standard-data-type-model';
import { SearchParam } from '../model/search-param.model';
import { StandardContent } from '../model/standard-search.model';

import { StandardService } from '../standard.service';

@Component({
  templateUrl: './standard-search.component.html',
  styleUrls: [ './standard-search.component.scss']
})
export class StandardSearchComponents implements OnInit {
  public headlist: HeadList[];

  private totalRecords: number;
  private searchParam: SearchParam;
  private standard: StandardContent;
  private standards: StandardContent[];
  private currentPage: number = 1;
  private sort: number;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private titleService: Title, private standardService: StandardService) {
    this.searchParam = new SearchParam();
    this.standard = new StandardContent();
    const title = this.titleService.getTitle();
    this.titleService.setTitle('标准搜索' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.searchParam.key = params['key'] || '机器人';
      this.searchParam.status = params.status || null;
      this.searchParam.option = params.option || 1;
      this.searchParam.page = params.page || 1;
      this.searchParam.sort = params.sort || 1;
      this.currentPage = this.searchParam.page;
      this.loadData(this.searchParam);
    });
  }

  public ngOnInit(): void {
    this.headlist = [
      {
        title: '状态',
        group: ['现行', '即将实施']
      }
    ];
    this.currentPage = 1;
  }

  // 搜索标准列表
  private loadData(searchParam: SearchParam) {
    this.standardService.getStandardList(searchParam).subscribe((res: any) => {
      this.standards = res['data']['resultList'];
      this.totalRecords = res['data']['size'];
      this.standards.forEach((item) => {
        item.department = item.department ? item.department['split'](/、|\s/) : '';
      });
    });
  }

  /**
   * 分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  private paginate(paginator: any) {
    const page = paginator.page + 1;
    this.currentPage = page;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activeRoute,
      queryParams: { page },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
    this.scrollTop();
  }

  private scrollTop() {
    window.scroll(0, 0);
  }
}
