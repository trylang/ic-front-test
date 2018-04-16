import { Component, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SnackBar } from '../../../tool/snackbar';

import { Account } from '../../../account.model';
import { PasswordComponent } from '../password/password.component';
import { AppService } from '../../../app.service';
import { PasswordService } from '../password/password.service';

@Component({
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  providers: [ PasswordService ]
})
export class SettingComponent implements OnInit {
  public ngxCropperConfig: object;
  public account: Account;
  public verify: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackBar,
    private appService: AppService,
    private passwordService: PasswordService,
    private dialog: MatDialog,
    private titleService: Title,
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('帐号设置' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.ngxCropperConfig = {
      url: this.appService.baseURL + '/account/addLogo', // image server url
      maxsize: 512000, // image max size, default 500k = 512000bit
      title: '调整你的头像的位置和尺寸', // edit modal title, this is default
      uploadBtnName: '上传头像', // default Upload Image
      uploadBtnClass: 'ark-upload-btn', // default bootstrap styles, btn btn-primary
      cancelBtnName: '取消', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: '应用', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'logo', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 1 / 1 // default 1 / 1, for example: 16 / 9, 4 / 3 ...
    };
  }

  public ngOnInit() {
    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : new Account();
    if (this.account && Array.isArray(this.account .roles)) {
        this.verify = this.account.hasVerify;
    }
  }

  public onReturnData(data: any) {
    data = JSON.parse(data);
    console.warn(data);
    if (data && data.data && data.data.code === '2000') {
      this.snackbar.success('头像更新成功');
      this.account.logo = `${data.data.data}`;

      this.appService.announceAccount(this.account);
    } else if (data) {
      if (data.code === 4002) {
        this.snackbar.warning('您只能选择图片格式的文件');
      } else if (data.code === 4000) {
        this.snackbar.warning(`您上传的图片超过了最大值500k, 当前${data.data}k`);
      } else if (data.code === 4001) {
        this.snackbar.warning('保存失败');
      }
    }
  }

  /**
   * 弹框显示修改密码MODEL
   * @memberof PasswordComponent
   */
  public pswChange(): void {
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { oldPassword: string; newPassword: string }) => {
      if (result && result.oldPassword && result.newPassword) {
        this.passwordService.changePWD(result.oldPassword, result.newPassword).subscribe((data: any) => {
          if ('2000' === data.code) {
            this.snackbar.success(data.messages, data.code);
            localStorage.clear(); // 清空用户信息
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  public verifyEmail(email: string) {
    if (email === null) {
      this.snackbar.warning('请输入邮箱');
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { email }
      };
      this.router.navigate(['/account/email'], navigationExtras);
    }
  }
}
