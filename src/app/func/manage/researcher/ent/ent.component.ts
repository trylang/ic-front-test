import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { SnackBar } from '../../../../tool/snackbar';
import { EntService } from './ent.service';
import { ManageService } from '../../manage.service';
import { Ent, QueryParam } from './model';

import { flyInOutAnimation } from '../../../../tool/animation';

@Component({
  templateUrl: './ent.component.html',
  animations: [ flyInOutAnimation ],
  styleUrls: ['./ent.component.scss'],
  providers: [EntService]
})
export class EntComponent implements OnInit {
  public ents: Ent[]; // 企业Res列表
  public totalRecords: number; // 分页功能-结果集总数
  public currentPage: number; // 当前页码
  public queryParam: QueryParam; // 查询参数

  constructor(
    private entService: EntService,
    private snackbar: SnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private manageService: ManageService
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.status = Number(params['status']) || 0;
      this.queryParam.key = params['key'] || null;
      this.queryParam.time = Number(params['time']) || 0;

      this.currentPage = this.queryParam.page;
      this.getCompaniesByOwner();
    });
  }

  /**
   * 下一分页
   *
   * @param {*} paginator
   * @memberof EntComponent
   */
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

  /**
   * 执行企业关键字搜索-路由跳转
   *
   * @param {string} keyword
   * @memberof EntComponent
   */
  public onSearch(keyword: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        key: keyword
      }
    };

    this.router.navigate([], navigationExtras);
  }

  /**
   * 更改时间排序
   *
   * @memberof EntComponent
   */
  public onChangeSort() {
    const time = this.queryParam.time === 0 ? 1 : 0;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        time
      }
    };
    this.router.navigate([], navigationExtras);
  }

  /**
   * 更改状态
   *
   * @param {number} status
   * @memberof EntComponent
   */
  public onChangeStatus(status: number) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        status
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onValidateAuthEdit(isClaimed: boolean, md5: string): void {
    if (isClaimed) {
      this.router.navigate(['../../public/ent/edit'], {
        relativeTo: this.route,
        queryParams: {
          md5
        }
      });
    } else {
      this.snackbar.info('请您先认领该企业', '没有权限');
    }
  }

  public toggleClaime(md5: string, isClaimed: boolean) {
    if (isClaimed) {
      // do cancel
      this.snackbar.info('您已经认领');
      // this.manageService.cancelClaimObject(md5, 0).subscribe((data: any) => {
      //   if ('2000' === data.code) {
      //     this.snackbar.success('取消认领成功');
      //     this.getCompaniesByOwner();
      //   }
      // });
    } else {
      // do confim
      this.manageService.claimObject(md5, 0).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('认领成功');
          this.getCompaniesByOwner();
        }
      });
    }
  }

  /**
   * 获取研究员企业列表
   *
   * @private
   * @param {number} [page=1]
   * @memberof EntComponent
   */
  private getCompaniesByOwner(): void {
    this.entService.getCompaniesByOwner(this.queryParam).subscribe(
      (data: any) => {
        if ('2000' === data.code) {
          this.ents = data.data;
          this.totalRecords = data.size;
        }
      }
    );
  }
}
