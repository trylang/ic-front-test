import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TreeNode } from 'primeng/primeng';
import swal from 'sweetalert2';

import { Editor } from '../../../../tool/editor';
import { SolutionEditService } from './solution-edit.service';
import { AppService } from '../../../../app.service';

import * as _ from 'lodash';

import { SnackBar } from '../../../../tool/snackbar';
import { ClaimeEntComponent } from '../claime-ent/claime-ent.component';
import { ClaimeProductComponent } from './claime-product/claime-product.component';

import { Solution } from './solution-edit.model';
import { Account } from '../../../../account.model';

@Component({
  templateUrl: './solution-edit.component.html',
  styleUrls: ['./solution-edit.component.scss'],
  providers: [SolutionEditService]
})
export class SolutionEditComponent implements OnInit, AfterViewInit {
  public ngxCropperConfig: object;
  public editorConf: object;
  public functions: string[];
  public industries: string[];
  public products: string[];
  public solution: Solution;
  public guardSolution: Solution;
  public userType: number;
  public parentRouter: { userType: number; routerLink: string; queryParams: {}, cat1?: string; cat2?: string; };

  public productCats: TreeNode[];
  public selectedProductCats: TreeNode[];
  public technologyCats: TreeNode[];
  public selectedTechnologyCats: TreeNode[];
  public industrybol: boolean; // 模态框状态值
  public industrystring: string;
  private md5: string;
  private companyName: string;
  private productNames: string[] = [];
  private isSubmiting: boolean = false;
  private accountEntity: any;

  constructor(
    private solutionEditService: SolutionEditService,
    private appService: AppService,
    private snackbar: SnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.ngxCropperConfig = {
      url: this.appService.baseURL + '/user/uploadPicture?entity=solution', // image server url
      maxsize: 307200, // image max size, default 300k = 307200bit
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

    this.editorConf = new Editor().config;
    this.solution = new Solution();
    this.guardSolution = new Solution();

    this.userType = (JSON.parse(localStorage.getItem('account')) as Account).type;

    const routerList = [{
      userType: 2,
      routerLink: '/manage/researcher/solution',
      queryParams: {},
      cat1: '方案列表'
    }, {
      userType: 3,
      routerLink: '/account/ent/ent/scheme',
      queryParams: {
        rootname: '我的方案'
      },
      cat1: '我的方案'
    }, {
      userType: 5,
      routerLink: '/manage/admin/solution',
      queryParams: {},
      cat1: '方案列表'
    }];
    this.parentRouter = routerList.filter((e: any) => e.userType === this.userType)[0];
    this.md5 = this.route.snapshot.queryParams['md5'];
    if (this.md5) {
      this.parentRouter.cat2 = '修改方案';
    } else {
      this.parentRouter.cat2 = this.parentRouter.userType === 3 ? '上传方案' : '新增方案';
    }

    if (this.userType === 3) {
      this.accountEntity = JSON.parse(localStorage.getItem('accountEntity'));
    }
  }

  public ngOnInit(): void {
    this.getProductCats();
    this.getFunctions();
    this.getIndustries();
    this.getProductCategories();
  }

  public ngAfterViewInit() {
    if (this.md5) {
      this.getSolution(this.md5);
    }
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
        this.companyName = result.name;
        this.solution.companyId = result.md5;
      }
    });
  }

  /**
   * 关联产品
   *
   * @memberof SolutionEditComponent
   */
  public onOpenProductDialog(): void {
    const dialogRef = this.dialog.open(ClaimeProductComponent, {
      data: this.solution.productIds || [],
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[]; names: string[] }) => {
      if (result && result.success === true) {
        this.solution.productIds = result.data;
        this.productNames = this.productNames.concat(result.names);
      }
    });
  }

  /**
   * 接收上传图片返回值
   *
   * @param {*} data
   * @memberof SolutionEditComponent
   */
  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data && data.data && data.data.code === '2000') {
      this.solution.logo = data.data.message;
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
   * 保存方案
   *
   * @memberof SolutionEditComponent
   */
  public onSave() {
    if (!this.isSubmiting) {
      this.isSubmiting = true;
    } else {
      return;
    }

    // 企业用户，设置companyId
    if (this.userType === 3) {
      this.solution.companyId = this.accountEntity.md5;
    }
    if (this.selectedProductCats) {
      const tmp = this.formatMultiSelect(this.selectedProductCats).splice(0, 3);
      this.solution.productCategories = tmp.length > 0 ? tmp : this.solution.productCategories;
    }
    if (this.selectedTechnologyCats) {
      const tmp = this.formatMultiSelect(this.selectedTechnologyCats).splice(0, 3);
      this.solution.technologyCategories = tmp.length > 0 ? tmp : this.solution.technologyCategories;
    }
    // this.md5 ? this.updateSolution() : this.addSolution();
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
        this.md5 ? this.updateSolution() : this.addSolution();
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

  public nodeSelectTechnology(event: any) {
    this.selectedTechnologyCats = this.selectedTechnologyCats.filter((e: any) => e.parent);

    if (this.selectedTechnologyCats.length > 4) {
      this.selectedTechnologyCats = this.selectedTechnologyCats.slice(0, 4);
      this.snackbar.warning('您最多只能选择4个分类');
    }
  }

  public nodeSelectProduct(event: any) {
    this.selectedProductCats = this.selectedProductCats.filter((e: any) => e.parent);

    if (this.selectedProductCats.length > 4) {
      this.selectedProductCats = this.selectedProductCats.slice(0, 4);
      this.snackbar.warning('您最多只能选择4个分类');
    }
  }

  /**
   * 格式化多选的产品和技术分类
   *
   * @private
   * @param {TreeNode[]} selectedItems
   * @returns {Array<{ category1: string; category2: string[] }>}
   * @memberof SolutionEditComponent
   */
  private formatMultiSelect(selectedItems: TreeNode[]): Array<{ category1: string; category2: string[] }> {
    const result: Array<{ category1: string; category2: string[] }> = [];

    // 1 format result
    selectedItems.forEach((e: TreeNode) => {
      if (e.parent) {
        // e.parent must exist. Except cate1 data.
        result.push({
          category1: e.parent.data,
          category2: [e.data]
        });
      }
    });

    function merge(arrayTmp: Array<{ category1: string; category2: string[] }>) {
      return _.uniqWith(arrayTmp, compareAndMerge);
    }

    function compareAndMerge(first: { category1: string; category2: string[] }, second: { category1: string; category2: string[] }) {
      if (first.category1 === second.category1) {
        first.category2 = second.category2 = [].concat(first.category2, second.category2);
        return true;
      }
      return false;
    }

    return merge(result);
  }

  /**
   * 获取功能分类
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private getFunctions() {
    this.solutionEditService.getFunctions().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.functions = data.data;
      }
    });
  }

  /**
   * 获取行业分类
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private getIndustries() {
    this.solutionEditService.getIndustries().subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data) {
          data.data.push('其他');
        }
        this.industries = data.data;
      }
    });
  }

  /**
   * 获取产品分类
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private getProductCategories() {
    this.solutionEditService.getProductCategories().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.products = data.data;
      }
    });
  }

  /**
   * 移除选中的项目
   * @param item
   * @param type
   */
  private removeItem(item: TreeNode, type: 'technology' | 'product' | 'relativeProduct') {
    if (type === 'technology') {
      this.selectedTechnologyCats.splice(this.selectedTechnologyCats.indexOf(item), 1);
    } else if (type === 'product') {
      this.selectedProductCats.splice(this.selectedProductCats.indexOf(item), 1);
    } else if (type === 'relativeProduct') {
      const index = this.productNames.indexOf(item as string);
      this.productNames.splice(index, 1);
      this.solution.productIds.splice(index, 1);
    }
  }

  /**
   * TODO: update next
   *
   * @private
   * @param {any[]} categories
   * @returns
   * @memberof SolutionEditComponent
   */
  private resultToSelectedData(selectedCategories: any[], categories: TreeNode[]) {
    if (selectedCategories && selectedCategories.length > 0) {
      const tmp: any[] = [];
      selectedCategories.forEach((e: any) => {
        categories.forEach((t: TreeNode) => {
          if (e.category1 === t.label) {
            t.children.forEach((c: TreeNode) => {
              e.category2.forEach((ec: string) => {
                if (c.label === ec) {
                  tmp.push(c);
                }
              });
            });

            // cat1 push
            if (e.category2.length === t.children.length) {
              tmp.push(t);
            }
          }
        });
      });

      return tmp;
    }
    return [];
  }

  /**
   * 获取方案详情
   *
   * @private
   * @param {string} md5
   * @memberof SolutionEditComponent
   */
  private getSolution(md5: string) {
    this.solutionEditService.getSolution(md5).subscribe((data: { code: string; data: Solution }) => {
      if ('2000' === data.code) {
        const result: Solution = {
          md5: this.md5,
          name: data.data.name,
          logo: data.data.logo,
          companyId: data.data.companyId,
          detail: data.data.detail,
          productIds: [], // 暂时不返回这个，后端处理复杂
          functionCategory: data.data.functionCategory,
          industryCategory: data.data.industryCategory,
          technologyCategories: data.data.technologyCategories,
          productCategories: data.data.productCategories
        };
        this.companyName = (data.data as any).companyName;

        // 赋值选中多选树
        this.selectedProductCats = this.resultToSelectedData(result.productCategories, this.productCats);
        this.selectedTechnologyCats = this.resultToSelectedData(result.technologyCategories, this.technologyCats);

        if ((data.data as any).products) {
          (data.data as any).products.forEach((e: any) => {
            result.productIds.push(e.md5);
            this.productNames.push(e.name);
          });
        }

        this.solution = _.cloneDeep(result);
        this.guardSolution = _.cloneDeep(result);
      }
    });
  }

  /**
   * 添加方案
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private addSolution(): void {
    this.solutionEditService.addSolution(this.solution).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardSolution = this.solution;
        this.snackbar.success('正在跳转到方案列表', '新增成功');

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
   * 修改方案
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private updateSolution(): void {
    this.solutionEditService.updateSolution(this.solution).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardSolution = this.solution;
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
   * 获取产品和技术分类
   *
   * @private
   * @memberof SolutionEditComponent
   */
  private getProductCats() {
    this.solutionEditService.getProductCats().subscribe((data: any) => {
      this.productCats = data.productCats;
      this.technologyCats = data.technologyCats;
    });
  }
}
