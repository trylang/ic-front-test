import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { SnackBar } from '../../../../tool/snackbar';
import { AppService } from '../../../../app.service';
import { CheckService } from './check.service';
import { Account } from '../../../../account.model';
import { EntUser } from '../../model/ent-user.model';
import { EntTypeComponent } from '../../../manage/public/ent-edit/ent-type/ent-type.component';
import { phoneValidator, nameValidator, passwordValidator, telValidator } from '../../../../tool/validator';
import * as _ from 'lodash';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  providers: [ CheckService ]
})
export class CheckComponent implements OnInit {
  public account: Account;
  public entUserForm: FormGroup;
  public state: number = 0;
  public provinces: string[];
  public departments: string[] = ['高管', '技术(产品、研发、维护、工程、生产)', '销售(市场、商务、销售)', '采购', '其他'];
  public entUser: EntUser = new EntUser();
  public entFormErrors = {
      companyName: '',
      address: '',
      region: '',
      contactPerson: '',
      personDepartment: '',
      contactPhone: '',
      companyPhone: '',
      license: ''
  };

  public validationMessages = {
    companyName: {
      required: '请输入企业名称',
      maxlength: '企业名称太长',
      invalidateName: '企业名不正确，仅支持中英文、数字和下划线，且不能为纯数字',
      exist: '企业已被认证'
    },
    address: {
      required: '请输入企业地址',
      maxlength: '企业地址太长',
    },
    region: {
      required: '请选择所属区域'
    },
    contactPerson: {
      required: '请输入联系人',
      maxlength: '联系人姓名太长',
    },
    personDepartment: {
      required: '请选择所属部门'
    },
    contactPhone: {
      required: '请输入手机号',
      arkValidatePhone: '手机号格式错误'
    },
    companyPhone: {
      arkValidateTel: '固定电话格式不正确'
    }
  };

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private snackbar: SnackBar,
      private appService: AppService,
      private checkService: CheckService,
      private dialog: MatDialog,
      private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('审核信息' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }

  public ngOnInit() {
      this.account = JSON.parse(localStorage.getItem('account'));
      this.getProvinces();
      this.getEntVerify();
      this.buildEntUserForm();
  }


  /**
   * 企业审核信息提交
   */
  public onSubmit(): void {
    if (this.entUser.username === null) { this.entUser.username = this.account.username; }
    this.checkService.saveEntVerifyResult(this.entUser).subscribe((data: any) => {
      if ('2000' === data.code) {
        _.delay(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  /**
   * 获取企业审核信息
   */
  public getEntVerify(): void {
    this.checkService.getEntVerify(this.account.username).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.entUser = data.data;
      } else {
        this.entUser = new EntUser();
      }
    });
  }

  /**
   * 上传LOGO
   *
   * @param {*} event
   * @returns
   * @memberof ParkEditComponent
   */
  public uploadLogo(event: any) {
    const files: FileList = event.srcElement.files;
    const fileName = files[0].name;
    const size = files[0].size;
    let dataURI: any;
    if (size > 512000) {
      this.snackbar.warning('请上传图片小于500k');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.addEventListener(
      'load',
      () => {
        dataURI = reader.result;
        this.saveImage(dataURI, fileName);
      },
      false
    );
  }

  /**
   * 弹框显示方案集成商和产品供应商复用EntTypeComponent组件
   */
  private openEntTypeModel() {
    const dialogRef = this.dialog.open(EntTypeComponent, {
      width: '800px',
      height: '400px',
      data: {
        solutions: this.entUser.solutionSupplierCategory || [],
        products: this.entUser.productSupplierCategory || []
      }
    });

    dialogRef.afterClosed().subscribe((result: {solutions: string[]; products: string[] }) => {
      if (result) {
        this.entUser.productSupplierCategory = result.products;
        this.entUser.solutionSupplierCategory = result.solutions;
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
      this.entUser.solutionSupplierCategory.splice(this.entUser.solutionSupplierCategory.indexOf(item), 1);
    } else {
      this.entUser.productSupplierCategory.splice(this.entUser.productSupplierCategory.indexOf(item), 1);
    }
  }

  /**
   * 保存 LOGO
   *
   * @private
   * @param {string} dataURI
   * @param {string} fileName
   * @memberof ParkEditComponent
   */
  private saveImage(dataURI: string, fileName: string) {
    this.checkService.saveImage(dataURI, fileName).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.entUser.license  = data.message;
      }
    });
  }

  /**
   * 获取省份
   *
   * @private
   * @memberof EntUserComponent
   */
  private getProvinces() {
    this.checkService.getProvinces().subscribe((data: any) => {
      this.provinces = data.provinces;
    });
  }

  /**
   * 校验企业是否已被认证
   * @param group
   */
  private serverNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<{ [key: string]: any }> => {
      if (control.value) {
        return new Promise((resolve: any) => {
          this.checkService.isExistEntName(control.value).subscribe((data: any) => {
            if ('2000' === data.code) {
              if (data.data) {
                this.entFormErrors['companyName'] += this.validationMessages['companyName'] + ' ';
              }
              return data.data ? {exist: true} : null;
            }
          });
        });
      } else {
        return new Promise((resolve: any) => resolve(null));
      }
    };
  }

  /**
   * 创建企业用户表单校验规则
   */
  private buildEntUserForm(): void {
    this.entUserForm = this.fb.group({
      companyName: [
        this.entUser.companyName,
        [
          Validators.required,
          Validators.maxLength(40),
          nameValidator,
          // this.serverNameValidator()
        ]
      ],
      address: [
        this.entUser.address,
        [
          Validators.required,
          Validators.maxLength(40),
        ]
      ],
      region: [
        this.entUser.region,
        [
          Validators.required,
        ]
      ],
      contactPerson: [
        this.entUser.contactPerson,
        [
          Validators.required,
          Validators.maxLength(10),
        ]
      ],
      personDepartment: [
        this.entUser.personDepartment,
        [
          Validators.required,
        ]
      ],
      contactPhone: [
        this.entUser.contactPhone,
        [
          Validators.required,
          phoneValidator()
        ]
      ],
      companyPhone: [
        this.entUser.companyPhone,
        [
          telValidator()
        ]
      ],
    });
    this.entUserForm.valueChanges.subscribe((data) => this.onEntValueChanged(data));
  }

  /**
   * 表单数据变化监听
   * @param data
   */
  private onEntValueChanged(data?: any) {
    if (!this.entUserForm) {
        return;
    }
    const form = this.entUserForm;

    for (const field of Object.keys(this.entFormErrors)) {
      // clear previous error message (if any)
      this.entFormErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
            this.entFormErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
