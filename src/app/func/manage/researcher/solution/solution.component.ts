import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';

import { SnackBar } from '../../../../tool/snackbar';
import { SolutionService } from './solution.service';
import { ManageService } from '../../manage.service';

import { QueryParam, Solution } from './model';

import { flyInOutAnimation } from '../../../../tool/animation';

@Component({
  templateUrl: './solution.component.html',
  animations: [ flyInOutAnimation ],
  styleUrls: ['./solution.component.scss'],
  providers: [SolutionService]
})
export class SolutionComponent implements OnInit {
  public solutions: Solution[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;

  constructor(
    private solutionService: SolutionService,
    private route: ActivatedRoute,
    private router: Router,
    private manageService: ManageService,
    private snackbar: SnackBar
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.status = Number(params['status']) || 0;
      this.queryParam.time = Number(params['time']) || 0;

      this.currentPage = this.queryParam.page;
      this.getSolutions();
    });
  }

  /**
   * enter get solution 根据关键字搜索
   *
   * @param {string} name
   * @memberof SolutionComponent
   */
  public onSearch(name: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        page: 1
      }
    };
    if (name) {
      navigationExtras.queryParams['key'] = name;
    }
    this.router.navigate([], navigationExtras);
  }

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

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: { page }
    };
    this.router.navigate([], navigationExtras);
  }

  public onValidateAuthEdit(isClaimed: boolean, md5: string): void {
    if (isClaimed) {
      this.router.navigate(['../../public/solution/edit'], {
        relativeTo: this.route,
        queryParams: {
          md5
        }
      });
    } else {
      this.snackbar.info('请您先认领该方案', '没有权限');
    }
  }

  public toggleClaime(md5: string, isClaimed: boolean) {
    if (isClaimed) {
      // do cancel
      this.snackbar.info('您已经认领');
      // this.manageService.cancelClaimObject(md5, 1).subscribe((data: any) => {
      //   if ('2000' === data.code) {
      //     this.snackbar.success('取消认领成功', '成功');
      //     this.getSolutions();
      //   }
      // });
    } else {
      // do confim
      this.manageService.claimObject(md5, 1).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('认领成功', '成功');
          this.getSolutions();
        }
      });
    }
  }

  /**
   * 搜索方案
   *
   * @private
   * @memberof SolutionComponent
   */
  private getSolutions() {
    this.solutionService.getSolutionsByOwner(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.solutions = data.data;
        this.totalRecords = data.size;
      }
    });
  }

}
