
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HomeService } from '../home.service';
import { SnackBar } from '../../../../tool/snackbar';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  public products: any[];
  public totalRecords: number;
  public type: string;
  public keyword: string;
  public currentPage: number = 1;
  private tempProductResults: string[] = [];
  private productResults: string[] = [];
  private searchFunc = {
    industry: (that: any, page: number, name: string) => {
      that.homeService.getIndustries().subscribe((data: any) => {
        if ('2000' === data.code) {
          data.data.forEach((e: any) => {
            const obj = {
              name : e,
              md5 : e,
              isClaimed: that.productResults.length > 0 && that.productResults.indexOf(e) > -1 ? true : false
            };
            that.products.push(obj);
          });
        }
      });
    },
    group: (that: any, page: number, name: string) => {
      const groups = ['默认分组', '竞争对手', '供应商', '客户'];
      that.products = groups;
    },
    park: (that: any, page: number, key: string) => {
      that.homeService.searchPark(page, key).subscribe((data: any) => {        
        if ('2000' === data.code) {
          data.data.resultList.forEach((e: any) => {
            e.isClaimed = that.productResults.length > 0 && that.productResults.indexOf(e.md5) > -1 ? true : false;
          });
          that.currentPage = page;
          that.products = data.data.resultList;
          that.totalRecords = data.data.size;
        }
      });
    },
    company: (that: any, page: number, key: string) => {
      that.homeService.searchCompany(page, key).subscribe((data: any) => {
        if ('2000' === data.code) {
          data.data.resultList.forEach((e: any) => {
            e.isClaimed = that.productResults.length > 0 && that.productResults.indexOf(e.md5) > -1 ? true : false;
          });
          that.currentPage = page;
          that.products = data.data.resultList;
          that.totalRecords = data.data.size;
        }
      });
    }
  };

  private searchTerms = new Subject<string>();

  constructor(
    private snackbar: SnackBar,
    private homeService: HomeService,
    public dialogRef: MatDialogRef<SubscribeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]
  ) {
    this.searchTerms
    .debounceTime(1000)
    .distinctUntilChanged()
    .subscribe((name: string) => {
      this.searchFunc[this.type](this, 1, name);
    });
  }

  public ngOnInit() {
    if (this.data) {
      this.type = this.data['type'];
      this.keyword = this.type === 'park' ? '工业' : '机器人';
      this.products = [];
      $.extend(this.tempProductResults, this.data['data']);
      $.extend(this.productResults, this.data['data']);
      this.searchFunc[this.type](this, 1, this.keyword);
    }
  }

  public toggleClaime(md5: string, name: string): void {
    if (this.productResults.length === 0 || this.productResults.indexOf(md5) === -1) {
      this.productResults.push(md5);
    } else {
      const index = this.productResults.indexOf(md5);
      this.productResults.splice(index, 1);
    }
    this.products.forEach((e: any) => {
      if (e.md5 === md5) {
        e.isClaimed = !e.isClaimed;
      }
    });
    if (!this.data['multiSelect']) {
      this.dialogRef.close({
        success: true,
        data: {
          data: this.productResults
        },
      });
    }
  }

  public onApply(type: string) {

    if (this.data['showButton'] && type === 'industry') {

      this.products.forEach((item) => {
        if (item.isClaimed && this.productResults.indexOf(item.name) < 0) {
          this.productResults.push(item.name);
        } else if (!item.isClaimed && this.productResults.indexOf(item.name) > -1) {
          this.productResults.splice(item.name, 1);
        }
      })
      if (this.productResults.length > 2) {
        this.snackbar.warning('最多选择两个行业');
        this.productResults = this.tempProductResults;
        return;
      }
    }

    this.dialogRef.close({
      success: true,
      data: {
        data: this.productResults
      },
    });
  }

  public onChange(name: string) {
    if (name) {
      this.searchTerms.next(name);
    }
  }

  public onSearch(type: string, name: string) {
    this.searchFunc[type](this, 1, name);
  }

  public paginate(paginator: any, type: string, name: string) {
    const page = paginator.page + 1;
    this.searchFunc[type](this, page, name);
  }

}
