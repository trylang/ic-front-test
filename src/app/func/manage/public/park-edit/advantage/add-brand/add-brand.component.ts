import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppService } from '../../../../../../app.service';
import { SnackBar } from '../../../../../../tool/snackbar';
import { ManageService } from '../../../../manage.service';
import { Brand } from '../brand.model';
import * as _ from 'lodash';

@Component({
  templateUrl: './add-brand.component.html',
  // styleUrls: ['./.component.css']
})
export class AddBrandComponent implements OnInit {
  public brand: Brand;
  public ngxCropperConfig: {};

  constructor(
    public dialogRef: MatDialogRef<AddBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    private manageService: ManageService,
    private snackbar: SnackBar,
    private appService: AppService
  ) {
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
    this.brand = _.cloneDeep(this.data);
  }

  public onApply() {
    if (!this.brand || this.brand && !this.brand.title || /^\s*$/.test(this.brand.title)) {
      this.snackbar.warning('品牌描述不能为空');
      return;
    }
    this.dialogRef.close({
      success: true,
      data: this.brand
    });
  }

  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data.code === 2000 && data.data && data.data.code === '2000') {
      this.brand.logo = data.data.message;
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
  //       this.brand.logo = data.message;
  //     }
  //   });
  // }
}
