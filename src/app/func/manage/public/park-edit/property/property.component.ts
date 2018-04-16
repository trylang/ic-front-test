import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { SnackBar } from '../../../../../tool/snackbar';

import { PropertyService } from './property.service';
import { Property } from './property.model';
import { AddPropertyComponent } from './add-property/add-property.component';

@Component({
  selector: 'park-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [PropertyService]
})
export class PropertyComponent implements OnInit {
  private md5: string;
  private properties: Property[];

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar,
    private dialog: MatDialog
  ) {
     // 首次进入页面初始化
     this.md5 = this.route.snapshot.queryParams['md5'] || null;
  }

  public ngOnInit() {
    if (this.md5) {
      this.getProperties();
    }
  }

  /**
   * 编辑 物业 Model
   *
   * @param {Property} [property]
   * @memberof PropertyComponent
   */
  public onOpenPropertyDialog(property?: Property) {
    const dialogRef = this.dialog.open(AddPropertyComponent, {
      data: property || new Property(),
      width: '800px',
      // height: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result: {success: boolean, data: Property}) => {
      if (result && result.success) {
        if (property) {
          this.changeParkProperty(result.data);
        } else { // new add
          this.addParkProperty(result.data);
        }
      }
    });
  }

  /**
   * 删除园区物业
   *
   * @param {string} id
   * @memberof PropertyComponent
   */
  private onDeleteProperty(id: string) {
    this.deleteParkProperty(id);
  }

  /**
   * 获取物业列表
   *
   * @private
   * @memberof PropertyComponent
   */
  private getProperties() {
    this.propertyService.getProperties(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.properties = data.data;
      }
    });
  }

  /**
   * 添加物业
   *
   * @private
   * @param {Property} property
   * @memberof PropertyComponent
   */
  private addParkProperty(property: Property) {
    this.propertyService.addParkProperty(this.md5, property).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('添加物业成功');
        this.getProperties();
      }
    });
  }

  /**
   * 修改物业
   *
   * @private
   * @param {Property} property
   * @memberof PropertyComponent
   */
  private changeParkProperty(property: Property) {
    this.propertyService.changeParkProperties(this.md5, property).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('修改物业成功');
        this.getProperties();
      }
    });
  }

  /**
   * 删除物业
   *
   * @private
   * @param {string} id
   * @memberof PropertyComponent
   */
  private deleteParkProperty(id: string) {
    this.propertyService.deleteParkProperty(this.md5, id).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除物业成功');
        this.getProperties();
      }
    });
  }
}
