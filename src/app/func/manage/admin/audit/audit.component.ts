import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { AuditService } from './audit.service';

import { flyInOutAnimation } from '../../../../tool/animation';
import { Req, Res } from './model';

@Component({
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  animations: [flyInOutAnimation],
  providers: [AuditService]
})
export class AuditComponent implements OnInit {
  private queryParam: Req;
  private audits: Res[];
  private currentPage: number = 1;
  private totalRecords: number = 0;
  private isEntList: boolean; // 判断是企业还是园区列表
  private title: string; // 企业还是园区

  constructor(private auditService: AuditService, private router: Router, private route: ActivatedRoute) {
    this.queryParam = new Req();
    this.isEntList = this.route.snapshot.queryParams['type'] === 'ent' ? true : false;
    this.title = this.isEntList ? '企业用户' : '园区用户';
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.state = Number(params['state']) === 0 ? 0 : Number(params['state']) || null;
      this.queryParam.sort = Number(params['sort']) || 0;

      this.currentPage = this.queryParam.page;

      // 进行企业园区切换
      this.isEntList = this.route.snapshot.queryParams['type'] === 'ent' ? true : false;
      this.title = this.isEntList ? '企业用户' : '园区用户';

      this.getList();
    });
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onSearch(key: string) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        key,
        page: 1
      }
    });
  }

  public onChangeSort() {
    const sort = this.queryParam.sort === 0 ? 1 : 0;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        sort
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onChangeState(state: number): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        state
      }
    };
    this.router.navigate([], navigationExtras);
  }

  /**
   * 获取企业列表
   *
   * @private
   * @memberof AuditComponent
   */
  private listEnterpriseVerify() {
    this.auditService.listEnterpriseVerify(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data) {
          data.data.forEach((e: Res) => {
            e.name = (e as any).companyName;
          });
        }
        this.audits = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 获取园区列表
   *
   * @private
   * @memberof AuditComponent
   */
  private listParkVerify() {
    this.auditService.listParkVerify(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data) {
          data.data.forEach((e: Res) => {
            e.name = (e as any).parkName;
          });
        }
        this.audits = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 获取结果
   *
   * @private
   * @memberof AuditComponent
   */
  private getList() {
    this.isEntList ? this.listEnterpriseVerify() : this.listParkVerify();
  }
}
