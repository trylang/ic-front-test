import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SolutionService } from '../service/solution.service';
import { SolutionList, Morelike } from '../model';
import * as _ from 'lodash';

@Component({
  selector: 'app-solution-detail',
  templateUrl: './solution-detail.component.html',
  styleUrls: ['./solution-detail.component.scss']
})
export class SolutionDetailComponent implements OnInit, AfterViewInit {

  private morelike: Morelike;
  private keywords: string[] = [];
  private solutions: any[];
  private solution: SolutionList;
  private cases: any[];
  private products: any[];
  private selItem: number = 0;

  constructor(
    private location: Location,
    private titleService: Title,
    private solutionService: SolutionService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.solution = new SolutionList();
  }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      (params) => {
        this.getSolutionDetail(params['md5']);
        this.getProductList(params['md5']);
        this.getCaseList(params['md5']);
        const keywords = [];
        // tslint:disable-next-line:no-unused-expression
        params['name'] && keywords.push(params['name'].trim());
        // tslint:disable-next-line:no-unused-expression
        params['industry'] && keywords.push(params['industry'].trim());
        this.morelike = new Morelike(params['md5'].trim(), keywords);
        this.loadData(this.morelike);
      }
    );
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  // 返回上一级
  public goBack() {
    this.location.back();
  }

  private onItemClick(type: number) {
    this.selItem = type;
  }

  public redirectToThis(md5: string, name: string, industry: string) {
    this.selItem = 0; // 默认都是详情
    this.router.navigate([], {
      queryParams: {
        md5,
        name,
        industry
      }
    });
  }


  /**
   * 相关案例
   * @private
   * @param {string} md5
   * @memberof SolutionDetailComponent
   */
  private getCaseList(md5: string) {
    this.solutionService.getCaseList(md5).subscribe((res) => {
      if ('2000' === res.code) {
        this.cases = res.data.length === 0 ? null : res.data;
      }
    });
  }

  /**
   * 相关产品
   * @param md5
   */
  private getProductList(md5: string) {
    this.solutionService.getProductList(md5).subscribe((res) => {
      if ('2000' === res.code) {
        this.products = res.data.length === 0 ? null : res.data;
      }
    });
  }

  /**
   * 获取方案详情
   *
   * @private
   * @param {string} md5
   * @memberof SolutionEditComponent
   */
  private getSolutionDetail(md5: string) {
    this.solutionService.getSolution(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.solution = res.data;

        const title = this.titleService.getTitle();
        this.titleService.setTitle(this.solution.name + '_方案详情' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }


  /**
   * 类似方案列表
   * @param {Solution} solution
   * @param {number} page
   * @returns
   * @memberof SolutionSearchComponent
   */
  private loadData(morelike: Morelike) {
    this.solutionService.getSolutionLikeList(morelike).subscribe(
    (res) => {
      if ('2000' === res['code']) {
        this.solutions = res['data']['resultList'];
      }
    });
  }
}
