import { Component, OnChanges, OnInit, Input, Renderer2, ElementRef } from '@angular/core';
import { Account } from '../../account.model';
import { AddCollectService } from './add-collect.service';
import { Observable } from 'rxjs/Observable';
import { SnackBar } from '../../tool/snackbar';
import * as _ from 'lodash';

@Component({
  selector: 'add-collect',
  template: `<button  (click)="onClick()" class="btn"
            [ngClass]="{'ark-upload-btn': textShow == '添加收藏', 'ark-cancel-btn': textShow == '取消收藏'}"
             *ngIf="account">{{textShow}}
             </button>`,
  providers: [AddCollectService]
})
export class AddCollectComponent implements OnChanges {
  @Input() private type: number; // 收藏类型 *必填: 1：专利  2：标准  3：园区  4：方案  5：产品  6：政策  7：企业（工商数据）  8. 企业（用户上传）.
  @Input() private md5: string; // 用于收藏唯一标识 *必填
  @Input() private textShow: string; // 收藏按钮的text文本信息。
  private account: Account;

  constructor(private collectService: AddCollectService, private snackbar: SnackBar) {
    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : null;
  }

  public ngOnChanges() {
    if (this.md5 && this.account) {
      this.getCollectStatus();
    }
  }

  public getCollectStatus() {
    this.collectService.getCollectStatus(this.type, this.md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.textShow = res.data ? '取消收藏' : '添加收藏';
      } else {
        this.snackbar.warning('获取收藏状态失败');
      }
    });
  }

  public onClick() {
    if (this.textShow === '添加收藏') {
      this.collectService.addCollect(this.type, this.md5).subscribe((res: any) => {
        if ('2000' === res.code) {
          this.getCollectStatus();
          this.snackbar.success('添加收藏成功');
        } else {
          this.snackbar.warning('添加收藏失败');
        }
      });
    } else {
      this.collectService.removeCollect(this.type, this.md5).subscribe((res: any) => {
        if ('2000' === res.code) {
          this.getCollectStatus();
          this.snackbar.success('取消收藏成功');
        } else {
          this.snackbar.warning('取消收藏失败');
        }
      });
    }
  }
}
