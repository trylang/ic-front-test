import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CompanyService } from '../service/company.service';
import { Company, SearchParam } from '../model';
import {  } from '../model/search-param.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class CompanySearchComponent implements OnInit {

  private keywords: string;
  private province: string;
  private productSuppliers: string;
  private solutionSuppliers: string;
  private sort: number;
  private provinces: string[];
  private size: string;
  private searchTextStream: Subject<string> = new Subject<string>();
  private page: number;
  private totalRecords: number = 0;
  private currentPage: number = 1;
  private productCats: any[];
  private companyCats: any[];
  private company: Company;
  private companys: Company[];
  private searchParam: SearchParam;

  constructor(
    private titleService: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private companyService: CompanyService
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('供应商搜索' +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.page = this.activeRoute.snapshot.params['page'];
    this.searchParam = new SearchParam();
    this.company = new Company();
  }


  public ngOnInit(): void  {
    this.getProvinces();
    this.getSearchAccess();
    this.activeRoute.queryParams.subscribe((params) => {
      // 这里可以从路由里面获取URL参数
      this.sort =  params.sort || -1;
      this.searchParam.sort = this.sort;
      this.province =  params.province || null;
      this.searchParam.province = this.province === '地区' || this.province === '全部' ? null : this.province ;
      this.keywords = params.key || '机器人';
      this.searchParam.key = this.keywords;
      this.page = params.page;
      this.currentPage = this.page || 1;
      this.searchParam.page = this.page;

      this.productSuppliers = params.productSuppliers;
      this.searchParam.productSuppliers = this.productSuppliers;
      this.solutionSuppliers = params.solutionSuppliers;
      this.searchParam.solutionSuppliers = this.solutionSuppliers;
      this.loadData(this.searchParam, this.page);
    });

    // 订阅了searchTextStream的Subject
    this.searchTextStream.debounceTime(1000).distinctUntilChanged().subscribe((keywords) => {
      this.router.navigate([], { queryParams: { key: keywords, page: 1 }, queryParamsHandling: 'merge'});
    });

  }

  // 备注信息
  public toggleUrl(type: string, label: string) {
    if (this.searchParam.productSuppliers || this.searchParam.solutionSuppliers || this.searchParam.page > 1) {
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
    this.scrollTop();
  }

  private scrollTop() {
    window.scroll(0, 0);
  }

  /**
   * 加载方案列表数据
   * @param {Solution} solution
   * @param {number} page
   * @returns
   * @memberof SolutionSearchComponent
   */
  private loadData(searchParam: SearchParam, page: number) {
    this.companyService.getCompanyList(searchParam, page).subscribe(
    (res) => {
      if ('2000' === res.code && res.data) {
        this.companys = res['data']['resultList'];
        this.size = res['data']['size'] >= 200 ? '200+' : res['data']['size'] ;
        this.totalRecords = res['data']['size'];
      }
    });
  }


  // 搜索内容变化触发searchTextStream订阅的subject
  private searchChanged($event: any): void {
    this.searchTextStream.next(this.keywords);
  }

  /**
   * 获取城市
   * @private
   * @memberof EntEditComponent
   */
  private getProvinces() {
    this.companyService.getProvinces().subscribe((data: any) => {
      this.provinces = data.search_province;
    });
  }

 /**
  * 获取搜索列表
  * @private
  * @memberof EntEditComponent
  */
  private getSearchAccess() {
    this.companyService.getSearchAccess().subscribe((data: any) => {
      this.productCats = data.productComp;
      this.companyCats = data.solutionComp;
    });
  }
}

