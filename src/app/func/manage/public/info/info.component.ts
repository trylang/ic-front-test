import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PasswordComponent } from '../../../account/password/password.component';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { Account } from '../../../../account.model';
import { InfoService } from './info.service';

import { SnackBar } from '../../../../tool/snackbar';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  providers: [InfoService]
})
export class InfoComponent implements OnInit {
  public ngxCropperConfig: object;
  public account: Account;

  constructor(
    private snackbar: SnackBar,
    private appService: AppService,
    private dialog: MatDialog,
    private infoService: InfoService,
    private router: Router
  ) {
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
  }

  public onReturnData(data: any) {
    data = JSON.parse(data);

    if (data && data.code === 2000 && data.data.code === '2000') {
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

  public onChangePass() {
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { oldPassword: string; newPassword: string }) => {
      if (result && result.oldPassword && result.newPassword) {
        this.infoService.changePWD(result.oldPassword, result.newPassword).subscribe((data: any) => {
          if ('2000' === data.code) {
            this.snackbar.success(data.messages, data.code);

            localStorage.clear(); // 清空用户信息
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
