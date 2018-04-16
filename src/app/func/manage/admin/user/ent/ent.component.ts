import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import swal from 'sweetalert2';
import { SnackBar } from '../../../../../tool/snackbar';

import { EntService } from './ent.service';
import { QueryParam, Res } from './model';

import { flyInOutAnimation } from '../../../../../tool/animation';

@Component({
  templateUrl: './ent.component.html',
  styleUrls: ['./ent.component.scss'],
  animations: [flyInOutAnimation],
  providers: [EntService]
})
export class EntComponent implements OnInit {
  private ents: Res;
  private queryParam: QueryParam;
  private totalRecords: number = 0;
  private currentPage: number = 1;

  constructor(private entService: EntService, private router: Router, private route: ActivatedRoute, private snackbar: SnackBar) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.key = params['key'] || null;
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.type = Number(params['type']) || null;

      this.currentPage = this.queryParam.page;
      this.getCompOrParkAccount();
    });
  }

  private paginate(paginator: any) {
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

  private onSearch(key: string) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        key,
        page: 1
      }
    });
  }

  private onDelete(username: string) {
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
        // do action confirm
        this.deleteAccount(username);
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          // do antion cancel
        }
      }
    );
  }

  private onChangeSort() {
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

  private onChangeType(type: number): void {
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

  /**
   * 获取企业园区用户列表
   *
   * @private
   * @memberof EntComponent
   */
  private getCompOrParkAccount() {
    this.entService.getCompOrParkAccount(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.ents = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 删除用户
   *
   * @private
   * @param {string} name
   * @memberof EntComponent
   */
  private deleteAccount(name: string) {
    this.entService.deleteAccount(name).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除用户成功');
        this.getCompOrParkAccount();
      }
    });
  }
}
