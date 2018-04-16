import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';

import { SnackBar } from '../../../../tool/snackbar';
import { ParkAdminService } from './park-admin.service';
import { QueryParam, Park } from './model';
import { flyInOutAnimation } from '../../../../tool/animation';
import swal from 'sweetalert2';

@Component({
  templateUrl: './park-admin.component.html',
  animations: [flyInOutAnimation],
  styleUrls: ['./park-admin.component.scss'],
  providers: [ParkAdminService]
})
export class ParkAdminComponent implements OnInit {
  public parks: Park[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;
  private provinces: string[];

  constructor(
    private parkAdminService: ParkAdminService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit(): void {
    this.getProvinces();

    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.type = Number(params['type']) || null;
      this.queryParam.province = params['province'] || null;
      this.queryParam.level = params['level'] || null;
      this.queryParam.stype = params['stype'] || 'key';

      this.currentPage = this.queryParam.page;
      this.getParks();
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
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        key: name
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

  public onChangeOwner(owner: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        owner
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
        this.deletePark(md5);
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.snackbar.info('已取消删除');
        }
      }
    );
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

  private onChangeSearchType(stype: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        stype
      }
    };
    this.router.navigate([], navigationExtras);
  }

  private onChangeProvince(province: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        province
      }
    };
    this.router.navigate([], navigationExtras);
  }

  private onChangeLevel(level: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        level
      }
    };
    this.router.navigate([], navigationExtras);
  }

  /**
   * 搜索园区
   *
   * @private
   * @memberof ParkComponent
   */
  private getParks() {
    this.parkAdminService.listParks(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.parks = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 删除园区
   *
   * @private
   * @param {string} md5
   * @memberof ParkComponent
   */
  private deletePark(md5: string) {

    this.parkAdminService.deletePark(md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除园区成功');
        this.getParks();
      }
    });
  }

  /**
   * 获取省份
   *
   * @private
   * @memberof ParkAdminComponent
   */
  private getProvinces() {
    this.parkAdminService.getProvinces().subscribe((data: any) => {
      this.provinces = data.provinces;
    });
  }
}
