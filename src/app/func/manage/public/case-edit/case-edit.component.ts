import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import swal from 'sweetalert2';

import { CaseService } from './case-edit.service';
import { AppService } from '../../../../app.service';

import { SnackBar } from '../../../../tool/snackbar';
import { ClaimeEntComponent } from '../claime-ent/claime-ent.component';

import * as _ from 'lodash';

import { Account } from '../../../../account.model';
import { Editor } from '../../../../tool/editor';
import { Case } from './case-edit.model';

@Component({
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
  providers: [CaseService]
})
export class CaseEditComponent implements OnInit, AfterViewInit {
  public ngxCropperConfig: object;
  public editorConf: object;
  public case: Case;
  public guardCase: Case; // 用于对比case，是否相等
  public startDate: Date; // 实施时间
  public solutions: Array<{ md5: string; name: string }>;
  public userType: number;
  public parentRouter: { userType: number; routerLink: string; queryParams: {}; cat1?: string; cat2?: string; };
  private md5: string;
  private maxDate: Date;
  private minDate: Date;
  private isSubmiting: boolean = false; // 等待服务器返回结果, true means res success, can do next action.
  private accountEntity: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,
    private appService: AppService,
    private snackbar: SnackBar,
    private dialog: MatDialog
  ) {
    this.ngxCropperConfig = {
      url: `${this.appService.baseURL}/user/uploadPicture?entity=case`, // image server url
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
    this.case = new Case();
    this.guardCase = new Case();
    this.minDate = new Date(1970, 0, 1);
    this.maxDate = new Date();

    this.userType = (JSON.parse(localStorage.getItem('account')) as Account).type;
    const routerList = [{
      userType: 2,
      routerLink: '/manage/researcher/case',
      queryParams: {},
      cat1: '案例列表'
    }, {
      userType: 3,
      routerLink: '/account/ent/ent/case',
      queryParams: {
        rootname: '我的案例'
      },
      cat1: '我的案例'
    }, {
      userType: 5,
      routerLink: '/manage/admin/case',
      queryParams: {},
      cat1: '案例列表'
    }];
    this.parentRouter = routerList.filter((e: any) => e.userType === this.userType)[0];
    this.md5 = this.route.snapshot.queryParams['md5'];
    if (this.md5) {
      this.parentRouter.cat2 = '编辑案例';
    } else {
      this.parentRouter.cat2 = this.parentRouter.userType === 3 ? '上传案例' : '新增案例';
    }

    if (this.userType === 3) {
      this.accountEntity = JSON.parse(localStorage.getItem('accountEntity'));

      this.getSolutions(this.accountEntity.md5);
    }
  }

  public ngOnInit() {
    // do
    }

  public ngAfterViewInit() {
    if (this.md5) {
      this.getCase(this.md5);
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
        this.case.companyName = result.name;
        this.case.companyMd5 = result.md5;

        this.case.solutionId = null; // 清空存储的md5,需要重新选择
        if (!this.solutions) {
          this.getSolutions(result.md5);
        }
      }
    });
  }

  /**
   * 处理上传图片返回结果
   *
   * @param {*} data
   * @memberof CaseEditComponent
   */
  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data && data.data && data.data.code === '2000') {
      this.case.logo = data.data.message;
    } else if (data) {
      if (data.code === 4002) {
        this.snackbar.warning('您只能选择图片格式的文件');
      } else if (data.code === 4000) {
        this.snackbar.warning(`您上传的图片超过了最大值300k, 当前${data.data}K`);
      } else if (data.code === 4001) {
        this.snackbar.warning('保存失败');
      }
    }
  }

  /**
   * click 保存 btn
   *
   * @memberof CaseEditComponent
   */
  public onSave() {
    if (!this.isSubmiting) {
      this.isSubmiting = true;
    } else {
      return;
    }

    // 企业用户，设置companyId
    if (this.userType === 3) {
      this.case.companyMd5 = this.accountEntity.md5;
    }
    this.case.startDate = this.startDate ? new Date(this.startDate).valueOf() : null;
    // this.md5 ? this.updateCase() : this.saveCase();
    this.onSubmitVerify();
  }

  /**
   * 获取案例详情
   *
   * @private
   * @param {string} md5
   * @memberof CaseEditComponent
   */
  private getCase(md5: string): void {
    this.caseService.getCase(md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.startDate = data.data.startDate ? new Date(data.data.startDate) : null;
        this.case = _.cloneDeep(data.data);
        this.guardCase = _.cloneDeep(data.data);
      }
    });
  }

  /**
   * 根据企业md5获取所有的方案
   *
   * @private
   * @param {string} md5
   * @memberof CaseEditComponent
   */
  private getSolutions(md5: string) {
    this.caseService.getSolutionsByCompanyMd5(md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.solutions = data.data;
      }
    });
  }

  /**
   * 提交保存
   *
   * @private
   * @memberof CaseEditComponent
   */
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
        this.md5 ? this.updateCase() : this.saveCase();
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
   * 新增案例
   *
   * @private
   * @memberof CaseEditComponent
   */
  private saveCase(): void {
    this.caseService.addCase(this.case).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.guardCase = this.case;
        this.snackbar.success('正在跳转到列表页', '新增成功');

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
   * 修改案例
   *
   * @private
   * @memberof CaseEditComponent
   */
  private updateCase(): void {
    this.caseService.updateCase(this.case).subscribe((data: any) => {
      this.guardCase = this.case;
      if ('2000' === data.code) {
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
}
