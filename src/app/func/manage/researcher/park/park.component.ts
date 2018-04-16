import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import { SnackBar } from '../../../../tool/snackbar';

import { ParkService } from './park.service';
import { ManageService } from '../../manage.service';
import { Park, QueryParam } from './model';

import { flyInOutAnimation } from '../../../../tool/animation';

@Component({
  templateUrl: './park.component.html',
  animations: [flyInOutAnimation],
  styleUrls: ['./park.component.scss'],
  providers: [ParkService]
})
export class ParkComponent implements OnInit {
  public parks: Park[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;

  constructor(
    private parkService: ParkService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackBar,
    private manageService: ManageService
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = params['page'] || 1;
      this.queryParam.status = Number(params['status']) || 0;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.key = params['key'] || null;

      this.currentPage = this.queryParam.page;
      this.getParks();
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

  public toggleClaime(md5: string, isClaimed: boolean) {
    if (isClaimed) { // do cancel
      this.snackbar.info('您已经认领');
    } else { // do confim
      this.manageService.claimObject(md5, 4).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('认领成功');
          this.getParks();
        }
      });
    }
  }

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

  public onValidateAuthEdit(isClaimed: string, md5: string): void {
    if (isClaimed) {
      this.router.navigate(['../../public/park/edit'], {
        relativeTo: this.route,
        queryParams: {
          md5
        }
      });
    } else {
      this.snackbar.info('请您先认领该园区', '没有权限');
    }
  }

  /**
   * 研究员获取园区列表
   *
   * @private
   * @memberof ParkComponent
   */
  private getParks() {
    this.parkService.getParks(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.parks = data.data;
        this.totalRecords = data.size;
      }
    });
  }
}
