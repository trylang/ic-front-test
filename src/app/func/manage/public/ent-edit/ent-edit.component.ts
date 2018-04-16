import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import swal from 'sweetalert2';

import { EntEditService } from './ent-edit.service';
import { AppService } from '../../../../app.service';
import { SnackBar } from '../../../../tool/snackbar';
import * as _ from 'lodash';

import { Account } from '../../../../account.model';
import { Ent } from './ent-edit.model';
import { Editor } from '../../../../tool/editor';

import { EntTypeComponent } from './ent-type/ent-type.component';

@Component({
  templateUrl: './ent-edit.component.html',
  styleUrls: ['./ent-edit.component.scss'],
  providers: [EntEditService]
})
export class EntEditComponent implements OnInit, AfterViewInit {
  public industries: string[];
  public provinces: string[];
  public ent: Ent;
  public guardEnt: Ent;
  public ngxCropperConfig: object;
  public editorConf: object;
  public editStatus: string;
  public isAdmin: boolean;
  public parentRouter: string;
  private md5: string;
  private isSubmiting: boolean = false;

  private productSupplierCategory: string[]; // 产品供应商
  private solutionSupplierCategory: string[]; // 方案供应商

  constructor(
    private entEditService: EntEditService,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private snackBar: SnackBar,
    private dialog: MatDialog
  ) {
    this.editorConf = new Editor().config;
    this.ent = new Ent();
    this.guardEnt = new Ent();

    this.ngxCropperConfig = {
      url: this.appService.baseURL + '/user/uploadPicture?entity=company', // image server url
      maxsize: 512000, // image max size, default 500k = 512000bit
      title: '调整你的照片的位置和尺寸', // edit modal title, this is default
      uploadBtnName: '选择图片', // default Upload Image
      uploadBtnClass: 'ark-upload-btn-primary', // default bootstrap styles, btn btn-primary
      cancelBtnName: '取消', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: '应用', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'upload', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 49 / 31 // default 1 / 1, for example: 16 / 9, 4 / 3 ...
    };

    this.isAdmin = (JSON.parse(localStorage.getItem('account')) as Account).type === 5 ? true : false;
    this.parentRouter = this.isAdmin ? '../../../admin/ent' : '../../../researcher/ent';
  }

  public ngOnInit(): void {
    this.getIndustries();
    this.getProvinces();

    this.md5 = this.route.snapshot.queryParams['md5'];
    if (this.md5) {
      this.editStatus = '修改企业';
    } else {
      this.editStatus = '新增企业';
    }
  }

  public ngAfterViewInit(): void {
    if (this.md5) {
      this.getCompany(this.md5);
    }
  }

  public onSubmit() {
    if (!this.isSubmiting) {
      this.isSubmiting = true;
    } else {
      return;
    }

    // this.md5 ? this.updateCompany() : this.addCompany();
    this.onSubmitVerify();
  }

  private onSubmitVerify() {
    swal({
      title: '您确定要保存吗？',
      text: '一旦保存，信息将发布到平台!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        this.md5 ? this.updateCompany() : this.addCompany();
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.isSubmiting = false;
          this.snackBar.info('已取消保存');
        }
      }
    );
  }

  /**
   * 接收上传图片返回值
   *
   * @param {*} data
   * @memberof EntEditComponent
   */
  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data.code === 2000 && data.data && data.data.code === '2000') {
      this.ent.logo = data.data.message;
    } else if (data) {
      if (data.code === 4002) {
        this.snackBar.warning('您只能选择图片格式的文件');
      } else if (data.code === 4000) {
        this.snackBar.warning(`您上传的图片超过了最大值500k, 当前${data.data}k`);
      } else if (data.code === 4001) {
        this.snackBar.warning('保存失败');
      }
    }
  }

  private openEntTypeModel() {
    const dialogRef = this.dialog.open(EntTypeComponent, {
      width: '800px',
      height: '400px',
      data: {
        solutions: this.ent.solutionSupplierCategory,
        products: this.ent.productSupplierCategory
      }
    });

    dialogRef.afterClosed().subscribe((result: {solutions: string[]; products: string[] }) => {
      if (result) {
        this.ent.productSupplierCategory = result.products;
        this.ent.solutionSupplierCategory = result.solutions;
      }
    });
  }

  /**
   * 从列表中删除该项
   *
   * @private
   * @param {string} item
   * @memberof EntEditComponent
   */
  private removeItem(item: string, type: 'solution' | 'product') {
    if (type === 'solution') {
      this.ent.solutionSupplierCategory.splice(this.ent.solutionSupplierCategory.indexOf(item), 1);
    } else {
      this.ent.productSupplierCategory.splice(this.ent.productSupplierCategory.indexOf(item), 1);
    }
  }

  /**
   * 获取行业
   *
   * @private
   * @memberof EntEditComponent
   */
  private getIndustries(): void {
    this.entEditService.getIndustries().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.industries = data.data;
      }
    });
  }

  /**
   * 获取省份
   *
   * @private
   * @memberof EntEditComponent
   */
  private getProvinces() {
    this.entEditService.getProvinces().subscribe((data: any) => {
      this.provinces = data.provinces;
    });
  }

  /**
   * 获取企业详情
   *
   * @private
   * @param {string} md5
   * @memberof EntEditComponent
   */
  private getCompany(md5: string): void {
    this.entEditService.getCompany(md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        const assignData = _.assign(
          {},
          data.data.ucCompany,
          { productSupplierCategory: data.data.productSupplierCategory },
          { solutionSupplierCategory: data.data.solutionSupplierCategory }
        );
        this.ent = _.cloneDeep(assignData);
        this.guardEnt = _.cloneDeep(assignData);
      }
    });
  }

  /**
   * 新增企业
   *
   * @private
   * @memberof EntEditComponent
   */
  private addCompany(): void {
    this.entEditService.addCompany(this.ent).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardEnt = this.ent;
        this.snackBar.success('正在跳转到企业列表', '新增成功');

        _.delay(() => {
          this.router.navigate([this.parentRouter], {
            relativeTo: this.route
          });

          this.isSubmiting = false;
        }, 1000);
      } else {
        this.isSubmiting = false;
      }
    });
  }

  /**
   * 修改企业
   *
   * @private
   * @memberof EntEditComponent
   */
  private updateCompany(): void {
    this.entEditService.updateCompany(this.ent).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardEnt = this.ent;
        this.snackBar.success('修改成功');

        _.delay(() => {
          this.router.navigate([this.parentRouter], {
            relativeTo: this.route
          });
          this.isSubmiting = false;
        }, 1000);
      } else {
        this.isSubmiting = false;
      }
    });
  }
}
