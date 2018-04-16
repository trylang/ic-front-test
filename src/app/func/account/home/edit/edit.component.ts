import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TreeNode } from 'primeng/primeng';
import { Title } from '@angular/platform-browser';

import { HomeService } from '../home.service';
import { AppService } from '../../../../app.service';

import { SnackBar } from '../../../../tool/snackbar';
import { SubscribeComponent } from '../subscribe/subscribe.component';

@Component({
  selector: 'home-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public parkTable: any = {
    columnDefs: {
      show: true,
      data: [{
      label: '园区名称',
      data: 'name',
      type: 'text',
      class: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'buttonGroup',
      class: '',
      modes: [{
        label: '取消订阅',
        type: 'button',
        class: '',
        style: {
          'width': '7rem',
          'cursor': 'pointer',
          'display': 'inline-block',
          'position': 'absolute',
          'left': '-2rem',
          'top': '-1rem',
          'border': '2px solid #ffbc5d',
          'border-radius': '20px',
          'text-align': 'center',
          'color': '#ffbc5d',
          'margin-right': '0.5em'
        },
        click: (row: any) => {
          this.cancelParkSub(row.id);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: false
    }
  };

  public companyTable: any = {
    columnDefs: {
      show: true,
      data: [{
      label: '企业名称',
      data: 'companyName',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '分组',
      data: 'groups',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'buttonGroup',
      class: '',
      modes: [{
        label: '修改分组',
        type: 'button',
        class: '',
        style: {
          'width': '7rem',
          'cursor': 'pointer',
          'display': 'inline-block',
          'position': 'absolute',
          'left': '-4rem',
          'top': '-1rem',
          'border': '2px solid #ffbc5d',
          'border-radius': '20px',
          'text-align': 'center',
          'color': '#ffbc5d',
          'margin-right': '0.5em'
        },
        click: (row: any) => {
          this.onOpenGroupDialog(row);
        }
      }, {
        label: '取消订阅',
        class: '',
        type: 'button',
        style: {
          'width': '7rem',
          'cursor': 'pointer',
          'display': 'inline-block',
          'position': 'absolute',
          'left': '4rem',
          'top': '-1rem',
          'border': '2px solid #ffbc5d',
          'border-radius': '20px',
          'text-align': 'center',
          'color': '#ffbc5d'
        },
        click: (row: any) => {
          this.deleteCompanySub(row.id);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: false
    }
  };

  public industrys: string[] = [];
  public companys: string[];
  public parks: string[];
  public account: Account;

  constructor(
    private homeService: HomeService,
    private snackbar: SnackBar,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('主页编辑' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.account = JSON.parse(localStorage.getItem('account'));
  }

   /**
    * 取消分组
    *
    * @memberof EditComponent
    */
  public onOpenGroupDialog(row: any): void {
    const dialogRef = this.dialog.open(SubscribeComponent, {
      // data: this.solution.productIds || [],
      data: {
        label: '分组名称',
        options: '选择',
        type: 'group',
        showButton: true,
        data: [row.groups]
      },
      width: '600px',
      height: '220px'
    });

    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[], names: string[] }) => {
      if (result && result.success === true) {
        this.companys = result.data;
        this.homeService.modifyCompanySub(row.id, result.data['data'][0]).subscribe((res: any) => {
          if (res.code === '2000') {
            this.companyTable.columns.map((item: any) => {
              if (item.id === row.id) {
                item.groups = result.data['data'][0];
              }
            });
          }
        });
      }
    });
  }

  /**
   * 关联行业
   *
   * @memberof EditComponent
   */
  public onOpenIndustryDialog(): void {
    const dialogRef = this.dialog.open(SubscribeComponent, {
      data: {
        label: '行业名称',
        options: '选择',
        type: 'industry',
        showButton: true,
        data: this.industrys
      },
      width: '800px',
      height: '270px'
    });
    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[], names: string[] }) => {
      if (result && result.success === true) {
        this.homeService.modifyIndustrySub(result.data['data']).subscribe((res: any) => {
          if (res.code === '2000') {
            this.industrys = result.data['data'];
          }
        });
      }
    });
  }

  /**
   * 关联园区
   *
   * @memberof EditComponent
   */
  public onOpenParkDialog(): void {
    if (this.parkTable.columns.length > 2) {
      this.snackbar.warning('最多订阅三个园区');
      return;
    }
    const dialogRef = this.dialog.open(SubscribeComponent, {
      // data: this.solution.productIds || [],
      data: {
        label: '园区名称',
        placeholder: '请输入园区名称',
        options: '订阅',
        type: 'park',
        data: []
      },
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[], names: string[] }) => {
      if (result && result.success === true) {
        this.parks = result.data;
        this.homeService.addParkSub(result.data['data'][0], '默认分组').subscribe((res: any) => {
          if (res.code === '2000') {
            this.parkTable.columns.unshift(res.data);
          }
        });
      }
    });
  }

  /**
   * 关联企业
   *
   * @memberof EditComponent
   */
  public onOpenCompanyDialog(): void {
    if (this.companyTable.columns.length > 2) {
      this.snackbar.warning('最多订阅三个企业');
      return;
    }
    const dialogRef = this.dialog.open(SubscribeComponent, {
      // data: this.solution.productIds || [],
      data: {
        label: '企业名称',
        placeholder: '请输入企业名称',
        options: '订阅',
        type: 'company',
        data: []
      },
      width: '800px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { success: boolean; data: string[], names: string[] }) => {
      if (result && result.success === true) {
        this.companys = result.data;
        this.homeService.addCompanySub(result.data['data'][0], '默认分组').subscribe((res: any) => {
          if (res.code === '2000') {
            this.companyTable.columns.unshift(res.data);
          }
        });
      }
    });
  }

  public ngOnInit() {
    this.getParkSub(1);
    this.getCompanySub(1);
    this.getIndustrySubscribe();
  }

  // 获取行业订阅
  private getIndustrySubscribe() {
    this.homeService.getIndustrySubscribe().subscribe((res: any) => {
      if (res.code === '2000') {
        this.industrys = res.data;
      }
    });
  }

  // 获取园区订阅列表
  private getParkSub(page: number) {
    this.homeService.getParkSub(page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.parkTable.columns = res.data;
      }
    });
  }

  // 获取企业订阅列表
  private getCompanySub(page: number) {
    this.homeService.getCompanySub(page).subscribe((res: any) => {
      this.companyTable.columns = res.data;
    });
  }

  // 删除一条订阅企业信息
  private deleteCompanySub(id: number) {
    this.homeService.deleteCompanySub(id).subscribe((res: any) => {
      if (res.code === '2000') {
        this.snackbar.success('企业取消订阅');
        this.companyTable.columns.forEach((item: any, index: number) => {
          if (item.id === id) {
            this.companyTable.columns.splice(index, 1);
          }
        });
      }
    });
  }

  // 取消园区的园区订阅
  private cancelParkSub(id: number) {
    this.homeService.cancelParkSub(id).subscribe((res: any) => {
      if (res.code === '2000') {
        this.snackbar.success('园区取消订阅');
        this.parkTable.columns.forEach((item: any, index: number) => {
          if (item.id === id) {
            this.parkTable.columns.splice(index, 1);
          }
        });
      }
    });
  }
}
