import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SnackBar } from '../../../../../tool/snackbar';
import { ClaimeProductService } from './claime-product.service';

@Component({
  templateUrl: './claime-product.component.html',
  providers: [ClaimeProductService]
  // styleUrls: ['./name.component.css']
})
export class ClaimeProductComponent implements OnInit {
  public products: any[];
  public totalRecords: number;
  public keyword: string;
  private productResults: string[] = [];
  private productNames: string[] = [];

  constructor(
    private snackbar: SnackBar,
    private claimeProductService: ClaimeProductService,
    public dialogRef: MatDialogRef<ClaimeProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]
  ) {}

  public ngOnInit() {
    if (this.data) {
      this.productResults = this.data; // .split(/[\,|\，]\s*/gi);
    }
    // this.getAllProducts(1);
  }

  public toggleClaime(md5: string, name: string): void {
    if (this.productResults.length === 0 || this.productResults.indexOf(md5) === -1) {
      this.productResults.push(md5);
      this.productNames.push(name);
    } else {
      const index = this.productResults.indexOf(md5);
      this.productResults.splice(index, 1);
      this.productNames.splice(index, 1);
    }

    this.products.forEach((e: any) => {
      if (e.md5 === md5) {
        e.isClaimed = !e.isClaimed;
      }
    });
  }

  public onApply() {
    this.dialogRef.close({
      success: true,
      data: this.productResults,
      names: this.productNames.map((e) => this.strip(e))
    });
  }

  private strip(html: string) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  public onSearch(name: string) {
    // TODO: page should recall 1
    if (!name) {
      this.snackbar.warning('请输入企业名称');
      return;
    }
    this.keyword = name;
    this.getAllProducts(1, name);
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.getAllProducts(page, this.keyword);
  }

  private getAllProducts(page: number = 1, name?: string) {
    this.claimeProductService.getAllProducts(page, name).subscribe((data: any) => {
      if ('2000' === data.code) {
        data.data.resultList.forEach((e: any) => {
          e.isClaimed = this.productResults.length > 0 && this.productResults.indexOf(e.md5) > -1 ? true : false;
        });
        this.products = data.data.resultList;
        this.totalRecords = data.data.size;
      }
    });
  }
}
