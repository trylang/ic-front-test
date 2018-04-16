// 通用列表模块 除信息模块
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { seaData, ListDatas } from '../ent-type';
import { EntServer } from '../service/ent.service';

import swal from 'sweetalert2';
import { SnackBar } from '../../../../../tool/snackbar';

@Component({
  selector: 'ent-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['../ent-common.component.css', './listbox.component.scss']
})
export class ListBoxComponents implements OnInit {
  public recdatas: seaData;
  public reqdatas: ListDatas;
  public recdata: any;
  public delURL: string;
  public skip: string;

  public totalRecords: number = 0;
  public currentPage: number = 1;
  public typeNow: number = 1;

  constructor(private router: Router, private route: ActivatedRoute, private entServer: EntServer, private snackBar: SnackBar) {
    this.recdata = '';
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.recdatas = {
        rootkey: location.pathname.slice(location.pathname.lastIndexOf('/') + 1),
        rootname: '方案'
      };
      this.FnSwitchMondule(this.recdatas.rootkey);
    });
  }

  public getdata(type: string, url: string, data?: any): void {
    this.entServer.FnEnts(type, url, data).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data) {
          this.recdata = data.data;
          this.totalRecords = data.size;
        }
      }
    });
  }

  public deleteData(type: string, url: string, data?: any): void {
    this.entServer.FnEnts(type, url, data).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackBar.success('删除成功');
        this.getdata('GET', '/enterpriseUser/getRelatedListByCurrentUser', {
          type: this.typeNow,
          pageNum: this.currentPage
        });
      }
    });
  }

  // 区分模块函数
  public FnSwitchMondule(key: string): void {
    switch (key) {
      case 'scheme':
        this.currentPage = 1;
        this.skip = '/account/scheme/edit';
        this.recdatas.rootname = '方案';
        this.delURL = '/user/deleteSolution';
        this.typeNow = 1;
        break;
      case 'case':
        this.currentPage = 1;
        this.skip = '/account/case/edit';
        this.delURL = '/user/deleteCase';
        this.recdatas.rootname = '案例';
        this.typeNow = 2;
        break;
      default:
        this.currentPage = 1;
        this.skip = '/account/product/edit';
        this.delURL = '/user/deleteProduct';
        this.recdatas.rootname = '产品';
        this.typeNow = 3;
    }
    this.getdata('GET', '/enterpriseUser/getRelatedListByCurrentUser', {
      type: this.typeNow,
      pageNum: this.currentPage
    });
  }

  public onDelete(md5: string) {
    swal({
      title: '您确定要删除吗？',
      text: '该操作将彻底删除，并且不能恢复!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        this.deleteData('GET', this.delURL, {
          md5
        });
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.snackBar.info('已取消删除');
        }
      }
    );
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.currentPage = page;
    this.getdata('GET', '/enterpriseUser/getRelatedListByCurrentUser', {
      type: this.typeNow,
      pageNum: this.currentPage
    });
  }
}
