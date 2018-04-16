import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EntTypeService } from './ent-type.service';

@Component({
  templateUrl: './ent-type.component.html',
  // styleUrls: ['./ent-type.component.scss']
  providers: [EntTypeService]
})
export class EntTypeComponent {
  public productSupplierCategory: Array<{name: string; isSelected: boolean; }>;
  public solutionSupplierCategory: Array<{name: string; isSelected: boolean; }>;

  constructor(
    private entTypeService: EntTypeService,
    @Inject(MAT_DIALOG_DATA) public data: {solutions: string[]; products: string[]},
    public dialogRef: MatDialogRef<EntTypeComponent>
  ) {
    this.getProductSupplierCategory();
    this.getSolutionSupplierCategory();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onClaime(): void {
    const solutions = this.solutionSupplierCategory.filter((e) => e.isSelected === true).map((e) => e.name);
    const products = this.productSupplierCategory.filter((e) => e.isSelected === true).map((e) => e.name);

    this.dialogRef.close({
      products,
      solutions
    });
  }

  /**
   * 获取产品供应商
   *
   * @private
   * @memberof EntTypeComponent
   */
  private getProductSupplierCategory() {
    this.entTypeService.getProductSupplierCategory().subscribe((data: any) => {
      const products = data.supplier.map((e: string) => {
        return {
          name: e,
          isSelected: this.data.products && this.data.products.length > 0 && this.data.products.indexOf(e) > -1 ? true : false
        };
      });

      this.productSupplierCategory = products;
    });
  }

  /**
   * 获取方案集成商
   *
   * @private
   * @memberof EntTypeComponent
   */
  private getSolutionSupplierCategory() {
    this.entTypeService.getSolutionSupplierCategory().subscribe((data: any) => {
      const solutions: Array<{ name: string; isSelected: boolean; }> = data.supplier.map((e: string) => {
        return {
          name: e,
          isSelected: this.data.solutions && this.data.solutions.length > 0 && this.data.solutions.indexOf(e) > -1 ? true : false
        };
      });

      this.solutionSupplierCategory = solutions;
    });
  }
}
