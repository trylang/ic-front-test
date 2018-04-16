import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { SnackBar } from '../../../../tool/snackbar';

import { AppService } from '../../../../app.service';
import { CheckService } from './check.service';
import { Account } from '../../../../account.model';
import { ParkUser } from '../../model/park-user.model';
import { phoneValidator, nameValidator, passwordValidator, telValidator } from '../../../../tool/validator';
import * as _ from 'lodash';
import { FileHolder } from 'angular2-image-upload';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  providers: [ CheckService ]
})
export class CheckComponent implements OnInit {
  public account: Account;
  public parkUserForm: FormGroup;
  public state: number = 0;
  public provinces: string[];
  public departments: string[] = ['高管', '技术(产品、研发、维护、工程、生产)', '销售(市场、商务、销售)', '采购', '其他'];
  public parkUser: ParkUser = new ParkUser();
  public imageUrl = this.appService.baseURL + '/user/uploadPicture?entity=verify';
  public uploaded: string[] = [];
  public formErrors = {
      parkName: '',
      address: '',
      region: '',
      operator: '',
      contactPerson: '',
      personDepartment: '',
      contactPhone: '',
      parkPhone: '',
      license: ''
  };

  public validationMessages = {
    parkName: {
      required: '请输入园区名称',
      maxlength: '园区名称太长',
      arkValidateName: '园区名称不正确，仅支持中英文、数字和下划线，且不能为纯数字',
      // exist: '园区已被认证'
    },
    address: {
      required: '请输入园区地址',
      maxlength: '园区地址太长'
    },
    region: {
      required: '请选择所属区域'
    },
    operator: {
      required: '请输入运营商',
      maxlength: '运营商名称太长'
    },
    contactPerson: {
      required: '请输入联系人',
      maxlength: '联系人姓名太长'
    },
    personDepartment: {
      required: '请选择所属部门'
    },
    contactPhone: {
      required: '请输入手机号',
      arkValidatePhone: '手机号格式错误'
    },
    parkPhone: {
      arkValidateTel: '固定电话格式不正确'
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private snackbar: SnackBar,
    private checkService: CheckService,
    private titleService: Title,
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('审核信息' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }

  public ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('account'));
    this.getProvinces();
    this.getParkVerify();
    this.buildParkUserForm();
  }

  /**
   * 提交表单保存审核信息
   */
  public onSubmit(): void {
    if (this.parkUser.username === null) { this.parkUser.username = this.account.username; }
    this.parkUser.parkCertificateLogo = [];
    _.forEach(this.uploaded, (item) => {
      const logoValue = item.substr(this.appService.imgPathPre.length + 1);
      this.parkUser.parkCertificateLogo.push({logo: logoValue});
    });
    this.checkService.saveParkVerityResult(this.parkUser).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success(data.message, data.code);
        _.delay(() => {
          window.location.reload();
      }, 500);
      }
    });
  }

  /**
   * 获取审核信息
   */
  public getParkVerify(): void {
    this.checkService.getParkVerify(this.account.username).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.parkUser = data.data;
        if (this.parkUser.parkCertificateLogo) {
          const uploaded: string[] = [];
          this.parkUser.parkCertificateLogo.forEach((e: any) => {
            uploaded.push(this.appService.imgPathPre + '/' + e.logo);
          });
          this.uploaded = uploaded;
        }
      } else if ('2022' === data.code) {
        this.parkUser.state = 1;
      } else {
         this.parkUser = new ParkUser();
      }
    });
  }

  /**
   * 上传图片事件-angular-image-upload
   * @param data
   */
  public onUploadFinished(data: any) {
    const tdata = JSON.parse(data.serverResponse._body);
    if (tdata && tdata.code === '2000') {
      this.uploaded.push( this.appService.imgPathPre + '/' + tdata.message);
    }
  }

  /**
   * 删除图片事件-angular-image-upload
   * @param event
   */
  public onRemoved(data: any) {
    const index = this.uploaded.indexOf(data.file.name);
    if (index > -1) {
      this.uploaded.splice(index, 1);
    }
  }

  /**
   * 上传图片状态监听-angular-image-upload
   * @param state
   */
  public onUploadStateChanged(state: boolean) {
    console.warn(this.uploaded);
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
        this.parkUser.license  = data.message;
      }
    });
  }

  /**
   * 接收上传的方案图片
   * @param {*} data
   * @memberof CheckComponent
   */
  private onReturnData(data: any) {
    const tdata = JSON.parse(data);
    if (tdata && tdata.code === 2000 && tdata.data.code === '2000') {
      this.parkUser.license = tdata.data.message;
    }  else if (tdata) {
      if (tdata.code === 4002) {
        this.snackbar.warning('您只能选择图片格式的文件');
      } else if (tdata.code === 4000) {
        this.snackbar.warning(`您上传的图片超过了最大值500k, 当前${tdata.data}k`);
      } else if (tdata.code === 4001) {
        this.snackbar.warning('保存失败');
      }
    }
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
   * 校验园区是否已被认证
   * @param group
   */
  private serverNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<{ [key: string]: any }> => {
      if (control.value) {
        return new Promise((resolve: any) => {
          this.checkService.isExistParkName(control.value).subscribe((data: any) => {
            if ('2000' === data.code) {
              if (data.data) {
                this.formErrors['parkName'] += this.validationMessages['parkName'] + ' ';
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
   * 创建园区审核表单校验规则
   */
  private buildParkUserForm(): void {
    this.parkUserForm = this.fb.group({
      parkName: [
        this.parkUser.parkName,
        [
          Validators.required,
          Validators.maxLength(40),
          nameValidator,
          // this.isExistParkName(this.parkUserForm)
        ]
      ],
      address: [
        this.parkUser.address,
        [
          Validators.required,
          Validators.maxLength(40),
        ]
      ],
      region: [
        this.parkUser.region,
        [
          Validators.required,
        ]
      ],
      operator: [
        this.parkUser.operator,
        [
          Validators.required,
          Validators.maxLength(40),
        ]
      ],
      contactPerson: [
        this.parkUser.contactPerson,
        [
          Validators.required,
          Validators.maxLength(10),
        ]
      ],
      personDepartment: [
        this.parkUser.personDepartment,
        [
          Validators.required,
        ]
      ],
      contactPhone: [
        this.parkUser.contactPhone,
        [
          Validators.required,
          phoneValidator()
        ]
      ],
      parkPhone: [
        this.parkUser.parkPhone,
        [
          telValidator()
        ]
      ],
    });
    this.parkUserForm.valueChanges.subscribe((data) => this.onValueChanged(data));
  }

  /**
   * 表单元素发生变化监听
   * @param data
   */
  private onValueChanged(data?: any) {
    if (!this.parkUserForm) {
        return;
    }
    const form = this.parkUserForm;

    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
