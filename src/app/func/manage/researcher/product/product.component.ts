import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import { SnackBar } from '../../../../tool/snackbar';

import { ProductService } from './product.service';
import { ManageService } from '../../manage.service';
import { Product, QueryParam } from './model';

import { flyInOutAnimation } from '../../../../tool/animation';

@Component({
  templateUrl: './product.component.html',
  animations: [flyInOutAnimation],
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {
  public products: Product[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;

  constructor(
    private caseService: ProductService,
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
      this.queryParam.key = params['key'] || null;
      this.queryParam.status = Number(params['status']) || 0;
      this.queryParam.time = Number(params['time']) || 0;

      this.currentPage = this.queryParam.page;
      this.getProductsByOwner();
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

  public onValidateAuthEdit(isClaimed: boolean, md5: string): void {
    if (isClaimed) {
      this.router.navigate(['../../public/product/edit'], {
        relativeTo: this.route,
        queryParams: {
          md5
        }
      });
    } else {
      this.snackbar.info('请您先认领该产品', '没有权限');
    }
  }

  public toggleClaime(md5: string, isClaimed: boolean) {
    if (isClaimed) { // do cancel
      this.snackbar.info('您已经认领');
      // this.manageService.cancelClaimObject(md5, 3).subscribe((data: any) => {
      //   if ('2000' === data.code) {
      //     this.snackbar.success('取消认领成功');
      //     this.getProductsByOwner();
      //   }
      // });
    } else { // do confim
      this.manageService.claimObject(md5, 3).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('认领成功');
          this.getProductsByOwner();
        }
      });
    }
  }

  public onSearch(key: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        page: 1
      }
    };
    if (key) {
      navigationExtras.queryParams['key'] = key;
    }

    this.router.navigate([], navigationExtras);
  }

  /**
   * 研究员获取产品列表
   *
   * @private
   * @memberof ProductComponent
   */
  private getProductsByOwner() {
    this.caseService.getProductsByOwner(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.products = data.data;
        this.totalRecords = data.size;
      }
    });
  }
}
