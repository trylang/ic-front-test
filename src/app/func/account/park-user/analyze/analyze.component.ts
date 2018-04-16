import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AnalyzeService } from './analyze.service';
import { SnackBar } from '../../../../tool/snackbar';
import { ReqEnt } from './req-ent.model';

import * as _ from 'lodash';
const BMap = window['BMap'];

@Component({
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss'],
  providers: [AnalyzeService]
})
export class AnalyzeComponent implements OnInit, OnDestroy {
  private keyword: string;
  private map: any;
  private overlays: any[] = [];
  private overlaysByAddCircle: any[] = [];
  private drawingManager: any;
  public currentPage: number; // 企业列表当前页

  private analysePaneState: boolean = false;
  private showAnalyse: boolean = false;
  private drawThis: string = 'hand'; // 默认先使用手状
  private showSearchResult: boolean = false; // 显示搜索结果列表
  private styleOptions: {};

  private queryParam: ReqEnt;
  private parkList: any[];
  private parkEntList: any[];
  private searchTotalRecords: number = 0;
  private entTotalRecords: number = 0;
  private aggList: { type: string[]; capi: string[]; createdAt: string[] } = {
    type: [],
    capi: [],
    createdAt: []
  };
  private selectedAggList: { type: string; capi: string; createdAt: string } = {
    type: null,
    capi: null,
    createdAt: null
  };

  // 展示半径，经纬度，圆圈中心名称
  private radius: string;
  private pos: { lng: number; lat: number };
  private centerName: string;

  constructor(
    private analyzeService: AnalyzeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackBar,
    private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('园区企业分析' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.route.queryParams.subscribe((params: Params) => {
      this.keyword = params['key'] || null;

      // 查询园区
      if (this.keyword) {
        this.searchPark();
      }
    });

    this.styleOptions = {
      strokeColor: '#3f7ebd', // 边线颜色。
      fillColor: '#3f7ebd', // 填充颜色。当参数为空时', '圆形将没有填充效果。
      strokeWeight: 3, // 边线的宽度', '以像素为单位。
      strokeOpacity: 0.8, // 线透明度', '取值范围0 - 1。
      fillOpacity: 0.2, // 填充的透明度', '取值范围0 - 1。
      strokeStyle: 'solid' // 边线的样式', 'solid或dashed。
    };

    this.queryParam = new ReqEnt();
  }

  public ngOnInit() {
    this.initBMap();
    this.clickDocument();
  }

  public ngOnDestroy() {
    document.removeEventListener('click', this.listenerHander.bind(this, this), false);
  }

  /**
   * 第一步：初始化BMap
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private initBMap() {
    // 百度地图API功能
    this.map = new window['BMap'].Map('allmap', {
      enableMapClick: false // 禁止点击底图
    });
    // 首先默认天安门， 参数：lng, lat
    const poi = new window['BMap'].Point(116.403906, 39.915175);
    this.map.centerAndZoom(poi, 16);
    this.map.enableScrollWheelZoom();

    // 更新坐标中心 按园区地址定位
    const address = JSON.parse(localStorage.getItem('accountEntity')).address;
    this.pointCenterByAddress(address, address, '全国');
    this.initDraw();
  }

  /**
   * 通过浏览器确定位置
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private pointCenterByGeo() {
    const geolocation = new window['BMap'].Geolocation();
    // 使用局部变量，避免作用域冲突
    const map = this.map;
    const pointCenterByIP = this.pointCenterByIP;

    geolocation.getCurrentPosition(
      function(r: any) {
        if (this.getStatus() === window['BMAP_STATUS_SUCCESS']) {
          map.panTo(r.point);
        } else {
          console.warn(`failed ${this.getStatus()}`);
          pointCenterByIP();
        }
      },
      {
        enableHighAccuracy: true
      }
    );
  }

  /**
   * 通过IP确定位置
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private pointCenterByIP() {
    const myCity = new window['BMap'].LocalCity();
    myCity.get((result: any) => {
      const cityName = result.name;
      this.map.setCenter(cityName);
    });
  }

  /**
   * 通过经纬度获取地址
   *
   * @private
   * @param {*} pt
   * @returns
   * @memberof AnalyzeComponent
   */
  private getLocationByLatlng(pt: any): Promise<string> {
    return new Promise((resove, reject) => {
      const myGeo = new window['BMap'].Geocoder();
      let address;
      myGeo.getLocation(pt, (rs: any) => {
        const addComp = rs.addressComponents;
        address = addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber;

        resove(address);
      });
    });
  }

  /**
   * 通过地址逆解析经纬度
   *
   * @private
   * @param {string} key
   * @param {string} address
   * @param {string} province
   * @memberof AnalyzeComponent
   */
  private pointCenterByAddress(key: string, address: string, province: string) {
    const myGeo = new window['BMap'].Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(
      address,
      (point: any) => {
        if (point) {
          this.map.centerAndZoom(point, 16);
          const marker = new BMap.Marker(point);
          this.map.addOverlay(marker);

          // 添加标注信息
          const opts = {
            width: 200, // 信息窗口宽度
            // height: 100, // 信息窗口高度
            title: `<h4 style="white-space: normal">${key}</h4>`, // 信息窗口标题
            enableMessage: true, // 设置允许信息窗发送短息
            message: ''
          };
          const msg = `
          <div><label>地址：</label> ${address}</div>
        `;
          const infoWindow = new BMap.InfoWindow(msg, opts); // 创建信息窗口对象
          marker.addEventListener('click', () => {
            this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
          });
        } else {
          // 定位失败，用 IP 定位
          this.pointCenterByIP();
          // this.snackBar.warning('暂无该地址的经纬度');
        }
      },
      province
    );
  }

  /**
   * 初始化标注
   *
   * @private
   * @param {any} data
   * @memberof AnalyzeComponent
   */
  private initMarker(data: any) {
    data.forEach((e: any) => {
      const points = (e.point = e.location
        .trim()
        .split(',')
        .reverse());
      const point = new BMap.Point(points[0], points[1]);

      const marker = new BMap.Marker(point);
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 15);

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
          <a href='/dc/#!/searchDetail/overview?id=${e.id_md5}&key=${e.name}' target="_blank" rel="noopener">查看详情</a>
        `;
      const infoWindow = new BMap.InfoWindow(msg, opts); // 创建信息窗口对象
      marker.addEventListener('click', () => {
        this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
      });
    });
  }

  private initDraw() {
    // 实例化鼠标绘制工具
    this.drawingManager = new window['BMapLib'].DrawingManager(this.map, {
      isOpen: false, // 是否开启绘制模式
      enableDrawingTool: false, // 是否显示工具栏
      drawingType: window['BMAP_DRAWING_CIRCLE'],
      drawingToolOptions: {
        anchor: window['BMAP_ANCHOR_TOP_LEFT'], // 位置
        offset: new BMap.Size(5, 5), // 偏离值
        drawingTypes: [window['BMAP_DRAWING_CIRCLE']]
      },
      circleOptions: this.styleOptions // 圆的样式
      // polylineOptions: styleOptions, //线的样式
      // polygonOptions: styleOptions, //多边形的样式
      // rectangleOptions: styleOptions //矩形的样式
    });
    // 添加鼠标绘制工具监听事件', '用于获取绘制结果
    this.drawingManager.addEventListener('overlaycomplete', (e: any) => {
      // 每次只绘制一个图', '页面最多只能有一个圆圈
      if (this.overlays.length > 0) {
        this.map.removeOverlay(this.overlays[0]);
        this.overlays.length = 0;
      }

      if (this.overlaysByAddCircle.length > 0) {
        this.map.removeOverlay(this.overlaysByAddCircle[0]);
        this.overlaysByAddCircle.length = 0;
      }

      this.overlays.push(e.overlay);

      this.radius = (e.overlay.xa / 1000).toFixed(4); // m to km
      this.pos = e.overlay.point; // {lng: '', lat: ''}
      this.getLocationByLatlng(new BMap.Point(e.overlay.point.lng, e.overlay.point.lat)).then((address: string) => {
        this.centerName = address; // 圆心名称
      });

      this.analysePaneState = true; // 保证结果列表面板始终是打开的

      // TODO: 获取画圈数据
      this.queryParam.lat = this.pos.lat;
      this.queryParam.lon = this.pos.lng;
      this.queryParam.distance = Number(this.radius);
      this.searchParkEnt(1);
    });
  }

  /**
   * 手动添加画圈
   *
   * @private
   * @param {*} mPoint
   * @param {number} radius
   * @memberof AnalyzeComponent
   */
  private addCricle(mPoint: any, radius: number) {
    // 确保，删除所有的圆圈overlay, 手动画的和自动生成的
    if (this.overlays.length > 0) {
      this.map.removeOverlay(this.overlays[0]);
      this.overlays.length = 0;
    }

    if (this.overlaysByAddCircle.length > 0) {
      this.map.removeOverlay(this.overlaysByAddCircle[0]);
      this.overlaysByAddCircle.length = 0;
    }

    // delete 自动添加的圆圈
    // const overlaysTmp = map.getOverlays();
    // overlaysTmp.forEach((e, i) => {
    //   if (e.V.localName === 'path') {
    //     map.removeOverlay(overlaysTmp[i]);
    //   }
    // });

    // 添加新的圆圈
    const circle = new BMap.Circle(mPoint, radius * 1000, this.styleOptions);
    this.map.addOverlay(circle);
    const circleOverlay = this.map.getOverlays().filter((e: any) => e.V && e.V.localName === 'path');
    this.overlaysByAddCircle.push(circleOverlay[0]);
  }

  // // 监听半径的改变，实时绘制圆圈
  // $scope.changeMapCircle = function() {
  //   addCricle($scope.parkMapData.pos, $scope.parkMapData.radius);
  // };

  /**
   * 切换手状和画圈功能
   *
   * @private
   * @param {string} type
   * @memberof AnalyzeComponent
   */
  private changeDrawType(type: string) {
    if (type === 'hand') {
      this.drawThis = 'hand';
      this.drawingManager.close();
    } else if (type === 'circle') {
      this.drawThis = 'circle';
      this.drawingManager.open();
      this.drawingManager.setDrawingMode(window['BMAP_DRAWING_CIRCLE']);
    }
  }

  /**
   * 搜索园区
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private onSearch() {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        key: this.keyword
      }
    });
  }

  /**
   * 选择园区并聚焦该园区到中心
   *
   * @private
   * @param {string} address
   * @memberof AnalyzeComponent
   */
  private onSelectPark(name: string, address: string) {
    if (this.overlaysByAddCircle.length > 0) {
      this.map.removeOverlay(this.overlaysByAddCircle[0]);
      this.overlaysByAddCircle.length = 0;
    }
    this.clearAllMarkers();
    this.pointCenterByAddress(name, address, 'shanghai');
  }

  /**
   * Input focus in & focus out
   *
   * @private
   * @param {boolean} b
   * @memberof AnalyzeComponent
   */
  private onToggleFocusInput(b: boolean, event: any) {
    // console.warn(event);
    this.showSearchResult = b;
  }

  /**
   * 切换结果集的企业表格
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private toggleAnalysePane() {
    this.analysePaneState = !this.analysePaneState;
  }

  /**
   * 清除所有Markers
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private clearAllMarkers() {
    const overlays = this.map.getOverlays();

    overlays.forEach((e: any, i: number) => {
      if (e.V && e.V.className && e.V.className === 'BMap_Marker BMap_noprint') {
        this.map.removeOverlay(overlays[i]);
      }
    });
  }

  /**
   * 点击企业过滤条件
   *
   * @private
   * @param {string} name
   * @param {string} type
   * @memberof AnalyzeComponent
   */
  private selectFilterItem(name: string | number, type: string) {
    this.selectedAggList[type] = name;
    this.queryParam.page = 1; // 选择任何过滤条件，分页都置1

    if (type === 'capi') {
      this.queryParam.capital = +name;
    }
    if (type === 'createdAt') {
      this.queryParam.date = +name;
    }
    if (type === 'type') {
      this.queryParam.status = String(name);
    }
    this.searchParkEnt(1);
  }

  /**
   * 处理搜索下拉列表框的focus and focusout
   *
   * @private
   * @param {Event} event
   * @memberof AnalyzeComponent
   */
  private clickSearchtoolContent(event: Event) {
    this.showSearchResult = true;
    event.stopPropagation();
  }

  private clickDocument() {
    document.addEventListener('click', this.listenerHander.bind(this, this), false);
  }

  private listenerHander() {
    this.showSearchResult = false;
  }

  /**
   * 搜索园区分页
   *
   * @private
   * @param {*} paginator
   * @memberof AnalyzeComponent
   */
  private searchPaginate(paginator: any) {
    const page = paginator.page + 1;
    this.searchPark(page);
  }

  /**
   * 搜索园区企业分页
   *
   * @private
   * @param {*} paginator
   * @memberof AnalyzeComponent
   */
  private entPaginate(paginator: any) {
    const page = paginator.page + 1;
    this.queryParam.page = page;
    this.searchParkEnt();
  }

  /**
   * 获取园区
   *
   * @private
   * @param {number} [page=1]
   * @memberof AnalyzeComponent
   */
  private searchPark(page: number = 1) {
    if (!this.keyword) {
      this.snackBar.warning('请输入园区名称');
      return;
    }
    this.analyzeService.searchPark(this.keyword, page).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.parkList = data.data.resultList.map((e: any, i: number) => {
          e.sortId = (page - 1) * 10 + i + 1;
          return e;
        });
        this.searchTotalRecords = data.data.size;
      }
    });
  }

  private changeMapCircle() {
    this.queryParam.distance = +this.radius;
    this.searchParkEnt(1);
    this.addCricle(this.pos, +this.radius);
  }

  /**
   * 获取园区企业
   *
   * @private
   * @memberof AnalyzeComponent
   */
  private searchParkEnt(page?: number) {
    this.queryParam.page = page || this.queryParam.page;
    this.currentPage = this.queryParam.page;

    this.analyzeService.searchParkEnt(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        data.data.resultList.forEach((e: any, i: number) => {
          e.sortId = (this.queryParam.page - 1) * 10 + i + 1;
        });
        this.aggList.type = data.data.aggList[0];
        const capital = ['100万以下', '100~200万', '200~500万', '500~1000万', '1000~5000万', '5000万以上'];

        const date = ['成立1年内', '成立1~5年', '成立5~10年', '成立10~15年', '成立15年以上'];
        // 注册资本
        this.aggList.capi = data.data.aggList[1].map((k: number) => {
          return {
            name: capital[k - 1],
            value: k
          };
        });
        // 成立日期
        this.aggList.createdAt = data.data.aggList[2].map((k: number) => {
          return {
            name: date[k - 1],
            value: k
          };
        });

        // this.aggList.capi = data.data.aggList[];

        this.parkEntList = data.data.resultList;
        this.entTotalRecords = data.data.size;

        // 清除掉所有的覆盖物，并且添加新的marker
        this.clearAllMarkers();
        this.initMarker(data.data.resultList);

        this.showAnalyse = true; // 展示企业分析面板
      }
    });
  }
}
