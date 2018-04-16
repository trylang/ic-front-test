import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import * as _ from 'lodash';
import { SnackBar } from '../../../../../tool/snackbar';
import { BasicService } from './basic.service';
import { ManageService } from '../../../manage.service';
import { Basic } from './basic.model';
import { AppService } from '../../../../../app.service';

@Component({
  selector: 'park-basic',
  templateUrl: './basic.component.html',
  providers: [ BasicService ]
})
export class BasicComponent implements OnInit {
  private basic: Basic;
  private md5: string;
  private industries: string[];
  private plants: string[];
  private userType: number;
  public ngxCropperConfig: {};

  constructor(
    private basicService: BasicService,
    private manageService: ManageService,
    private appService: AppService,
    private snackbar: SnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.basic = new Basic();
    // 首次进入页面初始化
    this.md5 = this.route.snapshot.queryParams['md5'] || null;
    this.userType = JSON.parse(localStorage.getItem('account')).type;

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
  }

  public ngOnInit() {
    this.getIndustryAndPlant();
    if (this.md5) {
      this.getBasic();
    }
  }

  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data.code === 2000 && data.data && data.data.code === '2000') {
      this.basic.logo = data.data.message;
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
   * 上传LOGO
   *
   * @param {*} event
   * @returns
   * @memberof ParkEditComponent
   */
  // public uploadLogo(event: any) {
  //   const files: FileList = event.srcElement.files;
  //   const fileName = files[0].name;
  //   const size = files[0].size;
  //   let dataURI: any;
  //   if (size > 512000) {
  //     this.snackbar.warning('请上传图片小于500k');
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.readAsDataURL(files[0]);
  //   reader.addEventListener(
  //     'load',
  //     () => {
  //       dataURI = reader.result;
  //       this.saveImage(dataURI, fileName);
  //     },
  //     false
  //   );
  // }

  /**
   * 保存 LOGO
   *
   * @private
   * @param {string} dataURI
   * @param {string} fileName
   * @memberof ParkEditComponent
   */
  // private saveImage(dataURI: string, fileName: string) {
  //   this.manageService.saveImage(dataURI, fileName).subscribe((data: any) => {
  //     if ('2000' === data.code) {
  //       this.basic.logo = data.message;
  //     }
  //   });
  // }

  /**
   * 保存园区基本信息
   *
   * @memberof BasicComponent
   */
  private saveBasic() {
    // validate area is +Number
    if (this.basic.area && this.basic.area < 0) {
      this.snackbar.warning('园区面积只可以是正数');
      return;
    }

    if (this.md5) {
      // update
      this.basicService.changeParkBasic(this.basic).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('修改园区基本信息成功');

          // emit update basic.
          if (this.userType === 4) {
            this.appService.announceAccountEntity(this.basic);
          }
        }
      });
    } else {
      // new add
      this.basicService.addParkBasic(this.basic).subscribe((data: any) => {
        if ('2000' === data.code) {
          this.snackbar.success('您可继续编辑', '新增成功');

          _.delay(() => {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                md5: data.data
              }
            });
          }, 100);
        }
      });
    }
  }

  /**
   * 获取园区的主导产业和基础设施
   *
   * @private
   * @memberof BasicComponent
   */
  private getIndustryAndPlant() {
    this.basicService.getIndustryAndPlant().subscribe((data: any) => {
      this.industries = data.industries;
      this.plants = data.plants;
    });
  }


  /**
   * 获取园区基本信息
   *
   * @private
   * @memberof BasicComponent
   */
  private getBasic() {
    this.basicService.getBasic(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.basic = data.data;
      }
    });
  }
}
