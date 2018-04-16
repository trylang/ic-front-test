import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { SnackBar } from '../../../tool/snackbar';

import { ParkService } from '../service/park.service';
import { Park, Result } from '../model';
import * as _ from 'lodash';

@Component({
  selector: 'app-park-detail',
  templateUrl: './park-detail.component.html',
  styleUrls: ['./park-detail.component.scss']
})
export class ParkDetailComponent implements OnInit {
  public md5: string;
  public park: Park;
  public mapLocation: any;
  public introduction: string;
  public preferential: string;
  public companies: Result[];
  public services: string;
  public brands: Result[];
  public tenements: Result[];
  public selItem: number = 0;
  public selChildItem: number = 0;
  public selMapItem: number = 0;
  public mapState: boolean[] = [false, false, false, false, false];
  public page: number = 1;
  public totalRecords: number;
  public mapDatas1: any[] = [];  // 用于存储百度地图地铁站搜索结果
  public mapDatas2: any[] = [];  // 用于存储百度地图火车站搜索结果
  public mapDatas3: any[] = [];  // 用于存储百度地图机场搜索结果
  public mapDataTotal1: number = 0;
  public mapDataTotal2: number = 0;
  public mapDataTotal3: number = 0;
  public mapDataPage1: number;
  public mapDataPage2: number;
  public mapDataPage3: number;

  constructor(
    private location: Location,
    private titleService: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private parkService: ParkService,
    private snackBar: SnackBar
  ) {
    this.park = new Park();
  }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      (params) => {
        this.md5 = params['md5'];
        // this.page = params.page == null ? 1 : params.page;
        this.getParkDetail(this.md5);
        this.getIntroductionById(this.md5);
        this.getCompaniesById(this.md5, this.page);
        this.getPreferentialById(this.md5);
        this.getServiceAdvById(this.md5);
        this.getBrandAdvsById(this.md5);
        this.getPropertiesById(this.md5);
      }
    );
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  // 返回上一级
  public goBack() {
    this.location.back();
  }

  /**
   * 状态切换(用于显示和隐藏地图的pannel)
   */
  private toggleMapPannel(type: number) {
    this.mapState[type] = !this.mapState[type];
  }

  // 顶层tab的item转换
  private onItemClick(type: number) {
    this.selItem = type;
  }

  // 园区信息tab的item转换
  private onChildItemClick(type: number) {
    this.selChildItem = type;
  }


  /**
   * 分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  private paginate(paginator: any) {
    this.page = paginator.page + 1;
    this.getCompaniesById(this.md5, this.page);
  }

  /**
   * 获取方案详情
   *
   * @private
   * @param {string} md5
   * @memberof SolutionEditComponent
   */
  private getParkDetail(md5: string) {
    this.parkService.getParkDetail(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.park = res.data;
        this.getMapMessage(this.park, this.selMapItem, 0);
        const title = this.titleService.getTitle();
        this.titleService.setTitle(this.park.name + '_园区详情' +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }

  // 地理优势tab的item转换
  private onMapItemClick(type: number) {
    this.selMapItem = type;
    _.delay(() => {
      this.getMapMessage(this.park, this.selMapItem, 0);
    }, 1000);
  }

  /**
   * 地图翻页
   * @param paginator
   */
  private searchMapDataPaginate(paginator: any) {
    const page = paginator.page;
    // this.getMapData(this.getMapKey(this.selMapItem), this.mapLocation, this.getDistance(this.selMapItem), page);
    this.getMapMessage(this.park, this.selMapItem, page);
  }

  /**
   * 获取园区介绍
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getIntroductionById(md5: string) {
    this.parkService.getIntroductionById(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.introduction = res.data;
      }
    });
  }

  /**
   * 获取优惠政策
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getPreferentialById(md5: string) {
    this.parkService.getPreferentialById(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.preferential = res.data;
      }
    });
  }

  /**
   * 获取入驻企业
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getCompaniesById(md5: string, page: number) {
    this.parkService.getCompaniesById(md5, page).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.totalRecords = res.size;
        this.companies = res.data;
      }
    });
  }

  /**
   * 获取服务优势
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getServiceAdvById(md5: string) {
    this.parkService.getServiceAdvById(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.services = res.data;
      }
    });
  }

  /**
   * 获取品牌优势
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getBrandAdvsById(md5: string) {
    this.parkService.getBrandAdvsById(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.brands = res.data.length === 0 ? null : res.data;
      }
    });
  }

  /**
   * 添加标注
   */
  private addMarker(data: any[], bmap: any) {
    const BMap = window['BMap'];
    data.forEach((e: any) => {
      const point =  new BMap.Point(e.location.lng, e.location.lat);
      const marker = new BMap.Marker(point);
      bmap.addOverlay(marker);

      // 添加标注信息
      const opts = {
        width: 200, // 信息窗口宽度
        // height: 100, // 信息窗口高度
        title: `<h4 style="white-space: normal">${e.name}</h4>`, // 信息窗口标题
        enableMessage: true, // 设置允许信息窗发送短息
        message: ''
      };
      const msg = `
          <div><label>地址：</label> ${e.address}</div>
        `;
      const infoWindow = new BMap.InfoWindow(msg, opts); // 创建信息窗口对象
      marker.addEventListener('click', () => {
        bmap.openInfoWindow(infoWindow, point); // 开启信息窗口
      });
    });
  }
  /**
   * 获取地理优势
   * @private
   */
  private getMapData(key: string, point: any, bmap: any, distance: number, page: number) {
    this.parkService.getMapData(key, point, distance, page).subscribe((res: any) => {
      if (0 === res.status) {
        if ('地铁站' === key) {
          this.mapDatas1 = [];
          this.mapDatas1 = res.results;
          this.mapDataPage1 = page + 1;
          this.mapDataTotal1 = res.total >= 200 ? 200 : res.total;
          this.addMarker(this.mapDatas1, bmap);
        } else if ('火车站' === key) {
          this.mapDatas2 = [];
          this.mapDatas2 = res.results;
          this.mapDataPage2 = page + 1;
          this.mapDataTotal2 = res.total >= 200 ? 200 : res.total;
          this.addMarker(this.mapDatas2, bmap);
        } else {
          this.mapDatas3 = [];
          this.mapDatas3 = res.results;
          this.mapDataPage3 = page + 1;
          this.mapDataTotal3 = res.total >= 200 ? 200 : res.total;
          this.addMarker(this.mapDatas3, bmap);
        }
      }
    });
  }

  private getMapKey(item: number): string {
    switch (item) {
      case 0:
          return '地铁站';
      case 1:
          return '火车站';
      case 2:
          return '机场';
      default: return '地铁站';
    }
  }

  private getDistance(item: number): number {
    switch (item) {
      case 0:
        return 2000;
      case 1:
        return 20000;
      case 2:
        return 5000;
      default:
        return 2000;
    }
  }

  private getDataItem(item: number): any {
    switch (item) {
      case 0:
        return this.mapDatas1;
      case 1:
        return this.mapDatas2;
      case 2:
        return this.mapDatas3;
      default:
        return this.mapDatas1;
    }
  }

  private getMapMessage(park: Park, item: number, pageNum: number) {
    // 地图初始化
    const BMap = window['BMap'];
    const bmap = new BMap.Map('allmap' + item, {
        enableMapClick: false // 禁止点击底图
    });

    // 首先默认天安门， 参数：lng, lat
    const poi = new window['BMap'].Point(116.403906, 39.915175);
    bmap.centerAndZoom(poi, 16);
    bmap.enableScrollWheelZoom();

    const myGeo = new BMap.Geocoder();
    myGeo.getPoint(park.address, (point: any) => {
      if (point) {
        const marker = new BMap.Marker(point);
        if (item === 0) {
          bmap.centerAndZoom(point, 15);
        } else {
          bmap.centerAndZoom(point, 12);
        }
        bmap.enableScrollWheelZoom();  // 开启鼠标滚轮缩放
        bmap.addOverlay(marker);  // 将标注添加到地图中

        this.mapLocation = point;
        // 添加标注信息：
        const opts = {
            width: 200,
            title: `<h4 style="white-space: normal"> ${park.address}</h4>`,
            enableMessage: true, // 设置允许信息窗发送短息
            message: ''
        };
        const msg = `
            <div><label>地址：</label> ${park.address}</div>
        `;
        const infoWindow = new BMap.InfoWindow(msg, opts); // 创建信息窗口对象
        marker.addEventListener('click', () => {
            bmap.openInfoWindow(infoWindow, point); // 开启信息窗口
        });

        // 添加新的圆圈
        const circle = new BMap.Circle(point, this.getDistance(item), {fillColor: 'blue', strokeWeight: 1 , fillOpacity: 0.3, strokeOpacity: 0.3});
        bmap.addOverlay(circle); // 增加圆
        this.getMapData(this.getMapKey(item), point, bmap, this.getDistance(item), pageNum);
      } else {
        this.snackBar.warning('暂无该地址的经纬度');
      }
    }, park.province);
  }


  /**
   * 获取物业信息
   * @private
   * @param {string} md5
   * @memberof ParkDetailComponent
   */
  private getPropertiesById(md5: string) {
    this.parkService.getPropertiesById(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.tenements = res.data.length === 0 ? null : res.data;
      }
    });
  }

}
