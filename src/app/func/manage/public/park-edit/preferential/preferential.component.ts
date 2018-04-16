import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import swal from 'sweetalert2';

import * as _ from 'lodash';
import { SnackBar } from '../../../../../tool/snackbar';
import { PreferentialService } from './preferential.service';
import { Editor } from '../../../../../tool/editor';
import { Intro } from './intro.model';

@Component({
  selector: 'park-preferential',
  templateUrl: './preferential.component.html',
  providers: [PreferentialService]
})
export class PreferentialComponent implements OnInit {
  private intro: Intro;
  private md5: string;
  private editorConf: {};

  constructor(
    private preferentialService: PreferentialService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar,
  ) {
    this.intro = new Intro();
    // 首次进入页面初始化
    this.md5 = this.route.snapshot.queryParams['md5'] || null;
    this.intro.md5 = this.md5;
    this.editorConf = new Editor().config;
  }

  public ngOnInit() {
    if (this.md5) {
      this.getIntroduction();
      this.getPreferential();
    }
  }

  /**
   * 保存园区介绍和政策
   *
   * @memberof ParkEditComponent
   */
  public saveIntro() {
    this.preferentialService.changeParkIntro(this.intro).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('修改园区介绍和政策成功');
      }
    });
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
        this.saveIntro();
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.snackbar.info('已取消保存');
        }
      }
    );
  }

  /**
   * 获取园区介绍
   *
   * @memberof ParkEditComponent
   */
  public getIntroduction() {
    this.preferentialService.getIntroduction(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.intro.introduction = data.data;
      }
    });
  }

  /**
   * 获取园区政策
   *
   * @memberof ParkEditComponent
   */
  public getPreferential() {
    this.preferentialService.getPreferential(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.intro.preferential = data.data;
      }
    });
  }
}
