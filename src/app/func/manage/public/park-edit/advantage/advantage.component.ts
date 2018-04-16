import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { SnackBar } from '../../../../../tool/snackbar';
import { AdvantageService } from './advantage.service';
import { Brand } from './brand.model';
import { AddBrandComponent } from './add-brand/add-brand.component';

@Component({
  selector: 'park-advantage',
  templateUrl: './advantage.component.html',
  styleUrls: ['./advantage.component.scss'],
  providers: [AdvantageService]
})
export class AdvantageComponent implements OnInit {
  private md5: string;
  private serviceAdv: string;
  private brand: Brand;
  private brands: Brand[];

  constructor(
    private advantageService: AdvantageService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    // 首次进入页面初始化
    this.md5 = this.route.snapshot.queryParams['md5'] || null;

    if (this.md5) {
      this.getBrandAdv();
      this.getServiceAdv();
    }
  }

  public onChangeServiceAdv() {
    this.changeParkServiceAdv();
  }

  /**
   * 编辑 品牌优势 Model
   *
   * @param {Brand} [brand]
   * @memberof AdvantageComponent
   */
  public onOpenBrandDialog(brand?: Brand) {
    const dialogRef = this.dialog.open(AddBrandComponent, {
      data: brand || new Brand(),
      width: '800px',
      // height: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result: { success: boolean; data: Brand }) => {
      if (result && result.success) {
        if (brand) {
          this.changeParkBrandAdv(result.data);
        } else {
          // new add
          this.addParkBrandAdv(result.data.title, result.data.logo);
        }
      }
    });
  }

  /**
   * 删除园区品牌优势
   *
   * @param {string} id
   * @memberof AdvantageComponent
   */
  public onDeleteBrand(id: string) {
    this.deleteParkBrandAdv(id);
  }

  /**
   * 修改园区服务优势
   *
   * @private
   * @memberof AdvantageComponent
   */
  private changeParkServiceAdv() {
    this.md5 = this.md5 || this.route.snapshot.queryParams['md5'];
    this.advantageService.changeParkServiceAdv(this.md5, this.serviceAdv).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('修改园区服务优势成功');
      }
    });
  }

  /**
   * 获取园区的服务优势
   *
   * @private
   * @memberof AdvantageComponent
   */
  private getServiceAdv() {
    this.advantageService.getServiceAdv(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.serviceAdv = data.data;
      }
    });
  }

  /**
   * 获取品牌优势
   *
   * @private
   * @memberof AdvantageComponent
   */
  private getBrandAdv() {
    this.advantageService.getBrandAdvs(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.brands = data.data;
      }
    });
  }

  /**
   * 修改品牌优势
   *
   * @private
   * @memberof AdvantageComponent
   */
  private changeParkBrandAdv(brand: Brand) {
    this.advantageService.changeParkBrandAdv(brand).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('修改园区品牌优势成功');
        this.getBrandAdv();
      }
    });
  }

  /**
   * 新增品牌优势成功
   *
   * @private
   * @memberof AdvantageComponent
   */
  private addParkBrandAdv(title: string, logo: string) {
    this.md5 = this.md5 || this.route.snapshot.queryParams['md5'];
    this.advantageService.addParkBrandAdv(this.md5, title, logo).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('新增品牌优势成功');
        this.getBrandAdv();
      }
    });
  }

  /**
   * 删除园区品牌优势
   *
   * @private
   * @param {string} id
   * @memberof AdvantageComponent
   */
  private deleteParkBrandAdv(id: string) {
    this.advantageService.deleteParkBrandAdv(id).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除品牌优势成功');
        this.getBrandAdv();
      }
    });
  }
}
