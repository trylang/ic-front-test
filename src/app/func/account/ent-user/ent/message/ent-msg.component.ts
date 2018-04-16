import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material';
import { EntTypeComponent } from '../../../../manage/public/ent-edit/ent-type/ent-type.component';

import { EntServer } from '../service/ent.service';
import { AccountService } from '../../../account.service';
import { seaData, ListDatas } from '../ent-type';
import { Editor } from '../../../../../tool/editor';
import { AppService } from '../../../../../app.service';
import { Account } from '../../../../../account.model';
import { SnackBar } from '../../../../../tool/snackbar';
import * as _ from 'lodash';
import { EntParam, BasicParam } from '../model';

@Component({
  templateUrl: './ent-msg.component.html',
  styleUrls: ['../ent-reset.component.scss' , './ent-msg.component.scss', '../ent-common.component.css']
})
export class EntMsgComponent implements OnInit {
  public recdata: any;
  public wrapdatas: ListDatas;
  public reqdatas: seaData;

  public entParam: EntParam; // 企业资料字段
  public basicParam: BasicParam; // 企业基本信息
  public productSupplierCategory: Array<{ name: string; isSelected: boolean; }>; // 产品供应商
  public solutionSupplierCategory: Array<{ name: string; isSelected: boolean; }>; // 方案集成商

  public ckeditorContent: any;
  public editorConf: {};
  public ngxCropperConfig: object;
  public account: Account;
  public entLogo: string;
  private tapstr: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private entServer: EntServer,
    private accountService: AccountService,
    private snackbar: SnackBar,
    private appService: AppService,
    public dialog: MatDialog
  ) {
    // 设置默认参数及默认logo图
    this.recdata = '';
    this.editorConf = (new Editor()).config;
    this.ngxCropperConfig = {
      url: this.appService.baseURL + '/user/uploadPicture?entity=company', // image server url
      maxsize: 307200, // image max size, default 300k = 307200bit
      title: 'logo文件的位置和尺寸', // edit modal title, this is default
      uploadBtnName: '选择文件', // default Upload Image
      uploadBtnClass: 'ark-upload-btn-primary', // default bootstrap styles, btn btn-primary
      cancelBtnName: '取消', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: '应用', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'upload', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 1 / 1// default 1 / 1, for example: 16 / 9, 4 / 3 ...
    };

    this.entParam = new EntParam();
    this.basicParam = new BasicParam();
  }

  public ngOnInit() {
    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : new Account();

    // 判断是企业资料还是基本资料
    this.route.queryParams.subscribe((params: Params) => {
      this.tapstr = params['rootname'] || '企业资料';
      if (this.tapstr === '企业资料') {
        this.getEntData(); // 获取企业资料
      } else {
        this.getBasicData();
      }
    });

    // 设置网页默认数据
    this.wrapdatas = {
      personDepartment: ['高管', '技术(产品、研发、维护、工程、生产)', '销售(市场、商务、销售)', '采购', '其他'],
      industry: {
        productSupplierCategory: [],
        solutionSupplierCategory: []
      },
      industryModel: false,
      region: [],
      selectind: 0,
      productcheckedGroup: ['', '', '', '', '', '', '', ''],
      solutioncheckedGroup: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      messagebol: false,
      mainProduct: ''
    };

    // 设置传输数据
    this.reqdatas = {
      serveUrl: '/enterpriseUser/modifyCompanyInformation',
      group: [
        {
          productSupplierCategory: [],
          solutionSupplierCategory: []
        }
      ]
    };

    this.getLocalJSON();
  }

  public openEntTypeDialog() {
    const dialogRef = this.dialog.open(EntTypeComponent, {
      width: '600px',
      height: '400px',
      data: { solutions: this.entParam.solutionSupplierCategory, products: this.entParam.productSupplierCategory }
    });

    dialogRef.afterClosed().subscribe((result: {solutions: string[]; products: string[]; }) => {
      if (result) {
        this.entParam.solutionSupplierCategory = result.solutions;
        this.entParam.productSupplierCategory = result.products;
      }
    });
  }

  public removeItem(item: string, type: 'solution' | 'product') {
    if (type === 'solution') {
      this.entParam.solutionSupplierCategory.splice(this.entParam.solutionSupplierCategory.indexOf(item), 1);
    } else {
      this.entParam.productSupplierCategory.splice(this.entParam.productSupplierCategory.indexOf(item), 1);
    }
  }

  // 获取远程数据
  public getdata(type: string, url: string, data?: any, isForm?: boolean): void {
    this.entServer.FnEnts(type, url, data, isForm).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data) {
          this.reqdatas.group = [
            {
              productSupplierCategory: data.data.productSupplierCategory || [],
              solutionSupplierCategory: data.data.solutionSupplierCategory || [],
            },
            data.data.address,
            data.data.region,
            data.data.contactPerson,
            data.data.personDepartment,
            data.data.contactPhone,
            data.data.companyPhone
          ];
          this.entLogo = data.data.logo;
          this.FnUseData(data.data);
        }
      }
    });
  }

  public saveData(type: string, url: string, pData?: any, isForm?: boolean) {
    this.entServer.FnEnts(type, url, pData, isForm).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('保存成功');
        if (this.tapstr === '基本信息') {
          // TODO: update account entity baseinfo. 目前只即刻更新企业头像
          const entity = JSON.parse(localStorage.getItem('accountEntity'));
          entity.logo = pData.logo;
          this.appService.announceAccountEntity(entity);
        }
      }
    });
  }

  // 根据tapstr选择使用远程数据
  public FnUseData(data?: any): void {
    this.recdata = data;
    if (this.tapstr === '企业资料') {
      this.account.logo = this.recdata.logo;
    } else {
      this.ckeditorContent = data['introduction'];
      this.wrapdatas.mainProduct = this.recdata.mainProduct ? this.recdata.mainProduct : '';
    }
    this.FnDafSel();
  }

  // 设置下拉菜单的默认选项
  public FnDafSel(): void {
    const SelEvents = document.querySelectorAll('.msg-sel') as HTMLSelectElement;
    let datakey = '';
    SelEvents.forEach((item: any, ind: number) => {
      if (ind === 0) { datakey = 'region'; } else if (ind === 1) { datakey = 'personDepartment'; }
      if (this.recdata[datakey]) {
        this.wrapdatas.selectind = this.wrapdatas[datakey].indexOf(this.recdata[datakey]) + 1;
        item.options[this.wrapdatas.selectind].selected = true;
      } else {
        item.options[0].selected = true;
      }
    });
  }

  // 设置下拉菜单的选项
  public FnSelect(event: any, datakey: number): void {
    const nowEvent = event.target;
    this.wrapdatas.selectind = nowEvent.selectedIndex;
    this.reqdatas.group[datakey] = nowEvent.options[this.wrapdatas.selectind].value;
  }

  // 保存按钮（根据tapstr保存相应数据）
  public FnSubBtn(): void {
    if (this.tapstr === '企业资料') {
      this.reqdatas.serveUrl = '/enterpriseUser/modifyCompanyInformation';
      let canSubmit: boolean = true;
      _.forEach(this.entParam, (k, v) => {
        if (k !== 'fixedPhone' && !v) {
          canSubmit = false;
        }
      });
      if (canSubmit) {
        this.saveData('POST', this.reqdatas.serveUrl, this.entParam, true);
      } else {
        this.snackbar.success('请输入必填内容');
      }

    } else {
      this.reqdatas.serveUrl = '/enterpriseUser/modifyCompanyLIM';
      this.saveData('POST', this.reqdatas.serveUrl, {
        logo: this.basicParam.logo,
        description: this.basicParam.description,
        mainProduct: this.basicParam.mainProduct
      }, true);
    }
  }

  // 设置logo图片
  public onReturnData(data: any) {
    data = JSON.parse(data);
    if (data && data.code === 2000 && data.data.code === '2000') {
      this.snackbar.success('logo更新成功');
      this.entLogo = `${data.data.message}`;
    }  else if (data) {
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
   * 获取企业资料
   *
   * @private
   * @returns
   * @memberof EntMsgComponent
   */
  private getEntData() {
    if (!this.account.username) {
      return;
    }
    this.entServer.getEnterpriseVerify(this.account.username).subscribe((data: {code: string; data: EntParam}) => {
      if ('2000' === data.code) {
        this.entParam = {
          companyName: data.data.companyName,
          productSupplierCategory: data.data.productSupplierCategory,
          solutionSupplierCategory: data.data.solutionSupplierCategory,
          address: data.data.address,
          region: data.data.region,
          contactPerson: data.data.contactPerson,
          personDepartment: data.data.personDepartment,
          contactPhone: data.data.contactPhone,
          companyPhone: data.data.companyPhone
        };
      }
    });
  }

  /**
   * 获取企业的基本信息
   *
   * @private
   * @memberof EntMsgComponent
   */
  private getBasicData() {
    this.entServer.getEntBasic().subscribe((data: any) => {
      this.basicParam = {
        logo: data.data.logo,
        mainProduct: data.data.mainProduct,
        description: data.data.introduction
      };
    });
  }

  // 获取省份数据
  private getLocalJSON() {
    this.entServer.getRegion().subscribe((data: any) => {
      this.wrapdatas.region = data.provinces;
    });
  }
}

