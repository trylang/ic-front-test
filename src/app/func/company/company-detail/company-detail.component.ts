import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../service/company.service';
import { Company } from '../model/company.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit, AfterViewInit {

  public company: Company;
  public solutions: any[];
  public products: any[];
  public patents: any[];
  public md5: string;
  public toolip: string;
  public selItem: number = 0;
  private stSize: number = 0;
  private ptSize: number = 0;
  private totalRecords: number = 0;
  private pc: number = 1;
  private sc: number = 1;
  private currentPage: number = 1;

  constructor(
    private location: Location,
    private titleService: Title,
    private router: Router,
    private companyService: CompanyService,
    private activeRoute: ActivatedRoute
  ) {
    this.company = new Company();
  }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      (params) => {
        const page = params['page'] || 1;
        this.md5 = params['md5'] || 1;
        this.getCompanyDetail(this.md5);
        this.getSolutionByCompanyId(this.md5, page);
        this.getProductByCompanyId(this.md5, page);
        this.getPatentByCompanyId(this.md5, page);
      }
    );
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  // 跳转到指定的网址
  public openNewPage(website: any) {
    window.open(website, '_blank');
  }

  // 返回上一级
   public goBack() {
    this.location.back();
  }

  // 切换tab页加载tab内容，初始page默认是1
  private onItemClick(type: number) {
    this.selItem = type;
  }

  /**
   * 方案分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  private paginate_sol(paginator: any) {
    this.sc = paginator.page + 1;
    this.getSolutionByCompanyId(this.md5, this.sc);

    window.scroll(0, 0);
  }

  /**
   * 产品分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  private paginate_prod(paginator: any) {
    this.pc = paginator.page + 1;
    this.getProductByCompanyId(this.md5, this.pc);
  }

  /**
   * 专利分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  private paginate(paginator: any) {
    this.currentPage = paginator.page + 1;
    this.getPatentByCompanyId(this.md5, this.currentPage);
  }

  /**
   * 获取供应商详情
   * @param md5
   */
  private getCompanyDetail(md5: string) {
    this.companyService.getCompanyDetail(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.company = res.data;
        this.toolip = res.data && res.data.mainProduct && res.data.mainProduct.replace(/<[^>]+>/g, '').replace(/[\r\n\s+]/g, '');
        const title = this.titleService.getTitle();
        this.titleService.setTitle(this.company.name + '_供应商详情' +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }

  /**
   * 获取相关方案
   * @param md5
   * @param pageNum
   */
  private getSolutionByCompanyId(md5: string, pageNum: number) {
    this.companyService.getSolutionByCompanyId(md5, pageNum).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.solutions = res.data.length === 0 ? null : res.data;
        this.stSize = res.size;
      }
    });
  }

  /**
   * 获取相关产品
   * @param md5
   * @param pageNum
   */
  private getProductByCompanyId(md5: string, pageNum: number) {
    this.companyService.getProductByCompanyId(md5, pageNum).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.products = res.data.length === 0 ? null : res.data;
        this.ptSize = res.size;
      }
    });
  }

  /**
   * 获取相关专利
   * @param md5
   * @param pageNum
   */
  private getPatentByCompanyId(md5: string, pageNum: number) {
    this.companyService.getPatentByCompanyId(md5, pageNum).subscribe((res: any) => {
      if ('2000' === res.code) {
        if (res.data && res.data.length > 0) {
          this.patents = res.data.map((e: any, i: number) => {
            e.sortId = (pageNum - 1) * 10 + 1 + i;
            return e;
          });
        }
        console.warn(this.patents);
        this.totalRecords = res.size;
      }
    });
  }
}
