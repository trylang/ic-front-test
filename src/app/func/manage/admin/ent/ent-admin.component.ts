import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import swal from 'sweetalert2';

import { EntAdminService } from './ent-admin.service';
import { Ent, QueryParam } from './model';

import { flyInOutAnimation } from '../../../../tool/animation';
import { SnackBar } from '../../../../tool/snackbar';

@Component({
  templateUrl: './ent-admin.component.html',
  animations: [flyInOutAnimation],
  providers: [EntAdminService]
})
export class EntAdminComponent implements OnInit {
  public queryParam: QueryParam;
  public ents: Ent[];
  public totalRecords: number;
  public currentPage: number;

  constructor(
    private entAdminService: EntAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackBar
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.type = Number(params['type']) || null;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.stype = params['stype'] || 'key';

      this.currentPage = this.queryParam.page;
      this.listCompanies();
    });
  }

  public onSearch(key: string): void {
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

  public onChangeType(type: number): void {
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

  public onChangeSort(): void {
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
   * 删除企业
   *
   * @param {string} md5
   * @memberof EntAdminComponent
   */
  public onDelete(md5: string) {
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
        this.entAdminService.deleteCompany(md5).subscribe((data: any) => {
          if ('2000' === data.code) {
            this.snackBar.success('删除企业成功');
            this.listCompanies();
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

  /**
   * 获取管理员的企业列表
   *
   * @private
   * @memberof EntAdminComponent
   */
  private listCompanies() {
    this.entAdminService.listCompanies(this.queryParam).subscribe(
      (data: any) => {
        if ('2000' === data.code) {
          this.ents = data.data;
          this.totalRecords = data.size;
        }
      }
    );
  }
}
