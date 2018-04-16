import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { SolutionService } from '../service/solution.service';
import { SearchParam } from '../model';
import * as _ from 'lodash';

@Component({
  templateUrl: './solution-search.component.html',
  styleUrls: ['./solution-search.component.scss']
})
export class SolutionSearchComponent implements OnInit {
  private industries: Array<{ name: string }>;
  private functions: Array<{ name: string }>;
  private keywords: string;
  private province: string;
  private sort: number;
  private industry: string;
  private function: string;
  private provinces: string[];
  private size: string;
  private searchTextStream: Subject<string> = new Subject<string>();
  private page: number;
  private totalRecords: number;
  private currentPage: number;
  private solutions: any[];
  private searchParam: SearchParam;

  constructor(private titleService: Title, private router: Router, private activeRoute: ActivatedRoute, private solutionService: SolutionService) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('方案搜索' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.page = this.activeRoute.snapshot.params['page'];
    this.searchParam = new SearchParam();
  }

  public ngOnInit() {
    this.getProvinces();
    this.getSearchAccess();

    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.keywords = params.key || '智慧工厂';
      this.searchParam.key = this.keywords;
      this.sort = params.sort || -1;
      this.searchParam.sort = this.sort;
      this.province = params.province || null;
      this.searchParam.province = this.province === '地区' || this.province === '全部' ? null : this.province;
      this.industry = params.industry;
      this.searchParam.industry = this.industry;
      this.function = params.function;
      this.searchParam.function = this.function;
      this.page = params.page;
      this.currentPage = this.page || 1;
      this.searchParam.page = params.page;
      this.loadData(this.searchParam);
    });

    // 订阅了searchTextStream的Subject
    this.searchTextStream
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((keywords: string) => {
        this.router.navigate([], { queryParams: { key: keywords, page: 1 }, queryParamsHandling: 'merge' });
      });
  }

  public toggleUrl(type: string, label: string) {
    if (this.searchParam.industry || this.searchParam.function || this.searchParam.page > 1) {
      // 两者都满足，说明是点击的同一个行业，行业需要消除
      this.searchParam[type] = this.searchParam[type] === label ? null : label;
      this.searchParam.page = 1;
      const navigationExtras: NavigationExtras = {
        relativeTo: this.activeRoute,
        queryParams: this.searchParam
      };
      this.router.navigate([], navigationExtras);
    }
  }

  /**
   * 分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  public paginate(paginator: any) {
    this.page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activeRoute,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
    $(window).scrollTop(0);
  }

  /**
   * 加载方案列表数据
   * @param {Solution} solution
   * @param {number} page
   * @returns
   * @memberof SolutionSearchComponent
   */
  private loadData(searchParam: SearchParam) {
    this.solutionService.getSolutionList(searchParam).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.solutions = res.data.resultList; // this.domSanitizer.bypassSecurityTrustStyle()
        this.size = res.data.size >= 200 ? '200+' : res.data.size;
        this.totalRecords =  res.data.size || 0;
      }
    });
  }

  // 搜索内容变化触发searchTextStream订阅的subject
  private searchChanged($event: any): void {
    this.searchTextStream.next(this.keywords);
  }

  /**
   * 获取省份
   *
   * @private
   * @memberof EntEditComponent
   */
  private getProvinces() {
    this.solutionService.getProvinces().subscribe((data: any) => {
      this.provinces = data.search_province;
    });
  }

  /**
   * 获取行业和功能
   * @private
   * @memberof SolutionSearchComponent
   */
  private getSearchAccess() {
    this.solutionService.getSearchAccess().subscribe((res: any) => {
      this.functions = res.function;
      this.industries = res.industry;
    });
  }
}
