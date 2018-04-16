import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { SolutionAdminService } from './solution-admin.service';

import { QueryParam, Solution } from './model';
import { flyInOutAnimation } from '../../../../tool/animation';
import { SnackBar } from '../../../../tool/snackbar';
import swal from 'sweetalert2';

@Component({
  templateUrl: './solution-admin.component.html',
  animations: [flyInOutAnimation],
  styleUrls: ['./solution-admin.component.scss'],
  providers: [SolutionAdminService]
})
export class SolutionAdminComponent implements OnInit {
  public solutions: Solution[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;

  constructor(private solutionAdminService: SolutionAdminService, private route: ActivatedRoute, private router: Router, private snackBar: SnackBar) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.type = Number(params['type']) || null;
      this.queryParam.stype = params['stype'] || 'key';

      this.currentPage = this.queryParam.page;
      this.getSolutions();
    });
  }

  /**
   * enter get solution 根据关键字搜索
   *
   * @param {string} key
   * @memberof SolutionComponent
   */
  public onSearch(key: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        key
      }
    };

    this.router.navigate([], navigationExtras);
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

  public onChangeSearchType(stype: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        stype
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onChangeType(type: number) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        type
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

  public onDelete(md5: string) {
    this.deleteSolution(md5);
  }

  /**
   * 搜索方案
   *
   * @private
   * @memberof SolutionComponent
   */
  private getSolutions() {
    this.solutionAdminService.listSolutions(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.solutions = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 删除方案
   *
   * @private
   * @param {string} md5
   * @memberof SolutionComponent
   */
  private deleteSolution(md5: string) {
    swal({
      title: '您确定要删除吗？',
      text: '该操作将彻底删除，并且不能恢复!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        this.solutionAdminService.deleteSolution(md5).subscribe((data: any) => {
          if ('2000' === data.code) {
            this.snackBar.success('删除方案成功');
            this.getSolutions();
          }
        });
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.snackBar.info('已取消删除');
        }
      }
    );
  }
}
