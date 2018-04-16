import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ParkService } from '../service/park.service';
import { Park, SearchParam } from '../model';
import {  } from '../model/search-param.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-park-list',
  templateUrl: './park-search.component.html',
   styleUrls: ['./park-search.component.scss']
})
export class ParkListComponent implements OnInit {

  private keywords: string;
  private province: string;
  private industry: string;
  private level: string;
  private tenement: string;
  private size: string;
  private time: string;
  private regions: string[] = ['上海'];
  private industries: string[];
  private tenements: string[] = ['办公楼', '研发楼', '厂房', '仓库', '土地'];
  private levels: string[] = ['国家级', '省级', '市级', '市级以下'];
  private searchTextStream: Subject<string> = new Subject<string>();
  private page: number;
  private totalRecords: number = 0;
  private currentPage: number = 1;
  private park: Park;
  private parks: Park[];
  private searchParam: SearchParam;

  constructor(
    private titleService: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private parkService: ParkService
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('园区搜索' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.page = this.activeRoute.snapshot.params['page'];
    this.searchParam = new SearchParam();
    this.park = new Park();
  }


  public ngOnInit(): void  {
    this.getIndustry();
    this.activeRoute.queryParams.subscribe((params) => {
    // 这里可以从路由里面获取URL参数
      this.keywords = params.key || '工业';
      this.searchParam.key = this.keywords;
      this.searchParam.sort =  params.sort || -1;
      this.province = params.province || 'all';
      this.searchParam.province = this.province === 'all' ? null : this.province ;
      this.level =  params.level || 'all';
      this.searchParam.level =  this.level === 'all' ? null : this.level;
      this.industry =  params.industries || 'all';
      this.searchParam.industries = this.industry === 'all' ? null : this.industry;
      this.tenement =  params.tenements || 'all';
      this.searchParam.tenements = this.tenement === 'all' ? null : this.tenement;
      this.searchParam.option = params.option || 1;
      this.page = params.page;
      this.currentPage = this.page || 1;
      this.searchParam.page =  this.page;
      this.loadData(this.searchParam);
    });

   // 订阅了searchTextStream的Subject
    this.searchTextStream.debounceTime(1000).distinctUntilChanged().subscribe((keywords) => {
      this.router.navigate([], { queryParams: { key: keywords, page: 1 }, queryParamsHandling: 'merge'});
    });

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
      queryParams: {page: this.page},
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
    this.parkService.getParkList(searchParam).subscribe(
    (res) => {
      if (res['code'] === '2000') {
        this.parks = res['data']['resultList'].map((e: any) => {
          if (e.tenements) {
            e.tenements.split(' ').filter((v: any, i: number, self: any[]) => {
              return self.indexOf(v) === i;
            });
          }
          return e;
        });
        // this.parks = res['data']['resultList'];
        this.size = res['data']['size'] >= 200 ? '200+' : res['data']['size'] ;
        this.time = res['data']['time'];
        this.totalRecords = res['data']['size'] || 0;
      }
    });
  }

  // 搜索内容变化触发searchTextStream订阅的subject
  private searchChanged($event: any): void {
    this.searchTextStream.next(this.keywords);
  }

  /**
   * 获取行业
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getIndustry() {
    this.parkService.getIndustryAndPlant().subscribe((json: any) => {
      if (json) {
        this.industries = json.industries;
      }
    });
  }

}

