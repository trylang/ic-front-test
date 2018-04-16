import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TreeNode } from 'primeng/primeng';
import swal from 'sweetalert2';

import { Editor } from '../../../../tool/editor';
import { AppService } from '../../../../app.service';
import { ProductEditService } from './product-edit.service';

import * as _ from 'lodash';

import { SnackBar } from '../../../../tool/snackbar';
import { ClaimeSolutionComponent } from './claime-solution/claime-solution.component';
import { ClaimeEntComponent } from '../claime-ent/claime-ent.component';

import { Product } from './product-edit.model';
import { Account } from '../../../../account.model';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [ProductEditService]
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  public ngxCropperConfig: object;
  public editorConf: object;
  public editStatus: string;
  public product: Product;
  public guardProduct: Product;
  public userType: number;
  public parentRouter: { userType: number; routerLink: string; queryParams: {}; cat1?: string; cat2?: string; };

  public productCats: TreeNode[];
  public selectedProductCats: TreeNode;
  private md5: string;
  private isSubmiting: boolean = false;
  private accountEntity: any;
  private relativeSolution: Array<{ name: string; md5: string; }> = [];

  constructor(
    private appService: AppService,
    private productEditService: ProductEditService,
    private snackbar: SnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.ngxCropperConfig = {
      url: `${this.appService.baseURL}/user/uploadPicture?entity=product`, // image server url
      maxsize: 307200, // image max size, default 300k = 307200bit
      title: '调整案例图片的位置和尺寸', // edit modal title, this is default
      uploadBtnName: '选择图片', // default Upload Image
      uploadBtnClass: 'ark-upload-btn-primary', // default bootstrap styles, btn btn-primary
      cancelBtnName: '取消', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: '应用', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'upload', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 43 / 30 // default 1 / 1, for example: 16 / 9, 4 / 3 ...
    };
    this.editorConf = new Editor().config;
    this.product = new Product();
    this.guardProduct = new Product();

    this.userType = (JSON.parse(localStorage.getItem('account')) as Account).type;

    const routerList = [{
      userType: 2,
      routerLink: '/manage/researcher/product',
      queryParams: {},
      cat1: '产品列表'
    }, {
      userType: 3,
      routerLink: '/account/ent/ent/goods',
      queryParams: {
        rootname: '我的产品'
      },
      cat1: '我的产品'
    }, {
      userType: 5,
      routerLink: '/manage/admin/product',
      queryParams: {},
      cat1: '产品列表'
    }];

    this.parentRouter = routerList.filter((e: any) => e.userType === this.userType)[0];
    this.md5 = this.route.snapshot.queryParams['md5'];
    if (this.md5) {
      this.parentRouter.cat2 = '修改产品';
    } else {
      this.parentRouter.cat2 = this.parentRouter.userType === 3 ? '上传产品' : '新增产品';
    }

    if (this.userType === 3) {
      this.accountEntity = JSON.parse(localStorage.getItem('accountEntity'));
    }
  }

  public ngOnInit() {
    this.getProductCats();
  }

  public ngAfterViewInit() {
    if (this.md5) {
      this.getProduct(this.md5);
    }
  }

  public onNodeSelect(event: any) {
    if (event.node.parent) {
      this.product.productCategory2 = event.node.data;
      this.product.productCategory1 = event.node.parent.data;
    } else {
      this.product.productCategory1 = event.node.data;
      this.product.productCategory2 = null;
    }
  }

  /**
   * 移除相关方案
   *
   * @param {string} md5
   * @param {'solution'} type
   * @memberof ProductEditComponent
   */
  public removeItem(md5: string, type: 'solution') {
    this.relativeSolution = this.relativeSolution.filter((e) => {
      return e.md5 !== md5;
    });
  }

  /**
   * 关联企业
   *
   * @memberof SolutionEditComponent
   */
  public onOpenEntDialog(): void {
    const dialogRef = this.dialog.open(ClaimeEntComponent, {
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { md5: string; name: string }) => {
      if (result && result.md5) {
        this.product.companyId = result.md5;
        this.product.companyName = result.name;
      }
    });
  }

  /**
   * 关联方案
   *
   * @memberof SolutionEditComponent
   */
  public onOpenSolutionDialog(): void {
    const dialogRef = this.dialog.open(ClaimeSolutionComponent, {
      data: this.relativeSolution,
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: Array<{ name: string; md5: string; }>) => {
      if (result) {
        this.relativeSolution = result;
      }
    });
  }

  /**
   * 接收上传图片返回值
   *
   * @param {*} data
   * @memberof ProductEditComponent
   */
  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data && data.data && data.data.code === '2000') {
      this.product.logo = data.data.message;
    } else if (data) {
      if (data.code === 4002) {
        this.snackbar.warning('您只能选择图片格式的文件');
      } else if (data.code === 4000) {
        this.snackbar.warning(`您上传的图片超过了最大值300k, 当前${data.data}k`);
      } else if (data.code === 4001) {
        this.snackbar.warning('保存失败');
      }
    }
  }

  /**
   * 保存产品
   *
   * @memberof ProductEditComponent
   */
  public onSave() {
    if (!this.isSubmiting) {
      this.isSubmiting = true;
    } else {
      return;
    }

    if (this.selectedProductCats) {
      if (this.selectedProductCats.label !== '其他') {
        if (this.selectedProductCats && !this.selectedProductCats.parent) {
          this.snackbar.warning('请选择产品分类，需要选择二级分类！');
          this.isSubmiting = false;
          return;
        } else if (this.selectedProductCats) {
          this.product.productCategory1 = this.selectedProductCats.parent.data;
          this.product.productCategory2 = this.selectedProductCats.data;
        }
      } else {
        this.product.productCategory1 = this.selectedProductCats.label;
        this.product.productCategory2 = this.selectedProductCats.label;
      }
    }

    this.product.solutionIds = this.relativeSolution.map((e) => e.md5);

    // 企业用户，设置companyId
    if (this.userType === 3) {
      this.product.companyId = this.accountEntity.md5;
    }
    // this.md5 ? this.updateProduct() : this.addProduct();
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
        this.md5 ? this.updateProduct() : this.addProduct();
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.isSubmiting = false;
          this.snackbar.info('已取消保存');
        }
      }
    );
  }

  /**
   * 获取产品详情
   *
   * @private
   * @param {string} md5
   * @memberof ProductEditComponent
   */
  private getProduct(md5: string) {
    this.productEditService.getProductByMD5(md5).subscribe((data: { code: string; data: Product }) => {
      if ('2000' === data.code) {
        this.product = _.cloneDeep(data.data);
        this.guardProduct = _.cloneDeep(data.data);

        this.getSimpleSolutionOfProduct(md5);
      }
    });
  }

  /**
   * 添加产品
   *
   * @private
   * @memberof ProductEditComponent
   */
  private addProduct(): void {
    this.productEditService.addProduct(this.product).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardProduct = this.product;
        this.snackbar.success('正在跳转到产品列表', '新增成功');

        _.delay(() => {
          this.router.navigate([this.parentRouter.routerLink], {
            relativeTo: this.route,
            queryParams: this.parentRouter.queryParams
          });
          this.isSubmiting = false;
        }, 1000);
      } else {
        this.isSubmiting = false;
      }
    });
  }

  /**
   * 修改产品
   *
   * @private
   * @memberof ProductEditComponent
   */
  private updateProduct(): void {
    this.productEditService.updateProduct(this.product).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardProduct = this.product;
        this.snackbar.success('修改成功');

        _.delay(() => {
          this.router.navigate([this.parentRouter.routerLink], {
            relativeTo: this.route,
            queryParams: this.parentRouter.queryParams
          });
          this.isSubmiting = false;
        }, 1000);
      } else {
        this.isSubmiting = false;
      }
    });
  }

  /**
   * 获取产品分类
   *
   * @private
   * @memberof ProductEditComponent
   */
  private getProductCats() {
    this.productEditService.getProductCats().subscribe((data: any) => {
      this.productCats = data.productCats;
    });
  }

  /**
   * 根据产品md5获取关联方案
   *
   * @private
   * @param {string} md5
   * @memberof ProductEditComponent
   */
  private getSimpleSolutionOfProduct(md5: string) {
    this.productEditService.getSimpleSolutionOfProduct(md5).subscribe((data: {code: string; data: any[]; }) => {
      if ('2000' === data.code && data.data && data.data.length > 0) {
        this.relativeSolution = data.data.map((e: any) => {
          return {
            name: e.name,
            md5: e.md5
          };
        });
      }
    });
  }
}
