import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import { MatDialog } from '@angular/material';
import { AddEntComponent } from './add-ent/add-ent.component';

import * as _ from 'lodash';
import { SnackBar } from '../../../../../tool/snackbar';
import { CompanyService } from './company.service';
import { Company } from './company.model';

@Component({
  selector: 'park-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [CompanyService]
})
export class CompanyComponent implements OnInit {
  private md5: string;
  private companies: Company[];
  private parkName: string = '';
  private companyTmp: { id: string; name: string} = {id: null, name: null};
  private totalRecords: number;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar,
    private dialog: MatDialog
  ) {
    // 首次进入页面初始化
    this.md5 = this.route.snapshot.queryParams['md5'] || null;

    const accountEntity = JSON.parse(localStorage.getItem('accountEntity'));
    if (accountEntity) {
      this.parkName = accountEntity.name;
    }
  }

  public ngOnInit() {
    if (this.md5) {
      this.getCompanies();
    }
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;

    this.getCompanies(page);
  }

  private showEditModal(id: string, name: string) {
    this.companies.forEach((e: any) => {
      e.isEditable = e.id === id ? true : false;
    });
  }

  /**
   * 获取园区入驻企业列表
   *
   * @private
   * @memberof CompanyComponent
   */
  private getCompanies(page: number = 1) {
    this.companyService.getCompanies(this.md5, page).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.companies = data.data.map((e: {}) => {
          return Object.assign({}, e, {
            isEditable: false
          });
        });
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 批量添加入驻企业
   *
   * @memberof ParkEditComponent
   */
  private onOpenEntDialog() {
    const dialogRef = this.dialog.open(AddEntComponent, {
      data: this.parkName,
      width: '800px'
      // height: '400px'
    });
    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[] }) => {
      if (result && result.success) {
        this.addCompanies(result.data);
      }
    });
  }

  /**
   * 添加入驻企业
   *
   * @private
   * @memberof CompanyComponent
   */
  private addCompanies(companies: string[]) {
    if (!companies || companies.length < 1) {
      this.snackbar.warning('您没有添加企业');
      return;
    }
    this.companyService.addParkCompanies(this.md5, companies).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('添加入驻企业成功');
        this.getCompanies();
      }
    });
  }

  /**
   * 删除入驻企业
   *
   * @private
   * @param {string} id
   * @memberof CompanyComponent
   */
  private onDeleteCompany(id: string) {
    this.companyService.deleteParkCompany(id).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除入驻企业成功');
        this.getCompanies();
      }
    });
  }

  /**
   * 修改入驻企业
   *
   * @private
   * @param {string} id
   * @param {string} name
   * @memberof CompanyComponent
   */
  private updateCompany(id: string, name: string) {
    if (!name) {
      this.snackbar.warning('企业名称不能为空');
      return;
    }
    this.companyService.changeParkCompany(id, name).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('修改入驻企业成功');
        this.companies.forEach((e: any) => {
          e.isEditable = e.id === id ? false : e.isEditable;
        });
      }
    });
  }
}
