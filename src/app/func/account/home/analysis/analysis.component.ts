import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Account } from '../../../../account.model';
import { SnackBar } from '../../../../tool/snackbar';
import { HomeService } from '../home.service';
import * as _ from 'lodash';

@Component({
  selector: 'ent-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  public  key: string;
  public  md5: string;
  public company: any;
  public entity: any;

  // 图标配置信息定义
  private courtPieConfig: {title: string; showLegend: boolean; topNum: number} = {
    title: '涉诉案由', showLegend: true, topNum: 6};
  private patentPieConfig: {title: string; showLegend: boolean; topNum: number} = {
    title: '专利分布', showLegend: true, topNum: 6 };
  private bidPieConfig: {title: string; showLegend: boolean; topNum: number} = {
    title: '中标行业', showLegend: true, topNum: 6 };
  private courtLineConfig: {title: string; isAreaStyle: boolean; showLegend: boolean} = {
    title: '涉诉趋势', isAreaStyle: true, showLegend: true};
  private patentBarConfig: {title: string; boundaryGap: boolean; isAreaStyle: boolean; showLegend: boolean} = {
    title: '专利申请趋势', boundaryGap: true, isAreaStyle: true, showLegend: true};
  private softRightBarConfig: {title: string; boundaryGap: boolean; showLegend: boolean} = {
    title: '软著申请趋势', boundaryGap: true, showLegend: true};
  private bidMapConfig: { title: string; minRange: number; maxRange: number; showLegend: boolean } = {
    title: '中标区域', minRange: 0, maxRange: 0, showLegend: true };

  // 图表数据容器定义
  private courtPieAggList: Array<{ name: string; data: any[]; }>;
  private patentPieAggList: Array<{ name: string; data: any[]; }>;
  private bidPieAggList: Array<{ name: string; data: any[]; }>;
  private bidMapAggList: Array<{ name: string; data: any[]}>;
  private courtLineAggList: Array<{ name: string; type: string; xData: string[]; yData: number[]}>;
  private patentBarAggList: Array<{ name: string; type: string; xData: string[]; yData: number[]}>;
  private softRightBarAggList: Array<{ name: string; type: string; xData: string[]; yData: number[]}>;

  // D3投资分析&股权比例
  private shareHoldData: any;
  private invRelationData: any;
  private mapdatamax: number = 0;
  private mapTempData: any[] = [];
  private provinces: any[] = ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '湖南',
  '黑龙江', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西',
   '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门', '南海诸岛'];

  // 舆情信息初始化
  private consensus = {};

  private account: Account;
  private item: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBar,
    private homeService: HomeService
  ) {
    this.entity = localStorage.getItem('accountEntity') ? JSON.parse(localStorage.getItem('accountEntity')) : null;
    this.md5 = this.entity ? this.entity.md5 : null;
    this.key = this.entity ? this.entity.md5 : null;
    this.route.queryParams.subscribe((params: Params) => {
      this.md5 = params['md5'] ? params['md5'] : this.entity.md5;
      this.key =  params['key'] ? params['key'] : this.entity.name;
    });
  }
  public ngOnInit() {
    this.initMapContainer();
    this.getCompanyEntity();
    this.getCompanyNews(1);
  }

  // 最新舆情分页
  public pageCompanyNewsNumber(paginator: any) {
    this.getCompanyNews(paginator.page + 1);
  }

  /**
   * 切换tab异步获取tab内容
   * @private
   * @param {number} type
   * @memberof HomeComponent
   */
  private onItemClick(type: number) {
    this.item = type;
    switch (this.item) {
      case 0:
        this.getCompanyNews(1);
        break;
      case 1:
        this.searchInvRelation();
        break;
      case 2:
        this.searchShareHold();
        break;
      case 3:
        this.searchCourdoc();
        break;
      case 4:
        this.searchPatent();
        this.searchSoftRight();
        break;
      case 5:
        this.searchBid();
        break;
    }
  }

  // 获取最新舆情
  private getCompanyNews(page: number) {
    this.homeService.getCompanyNewsList(this.md5, page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.consensus = {
          currentPage: page,
          size: res.size,
          data: res.data
        };
      }
    });
  }

  /**
   * 重置投资分析返回数据格式
   * @param json
   */
  private resetTree(json: any) {
    const rs = [];
    if (json.hasOwnProperty('stocks')) {
      const stocks = JSON.parse(json.stocks);
      stocks.name = '股东';
      rs.push(stocks);
    }
    if (json.hasOwnProperty('invests')) {
      const invests = JSON.parse(json.invests);
      invests.name = '投资';
      rs.push(invests);
    }
    return {
      name: '所有',
      children: rs
    };
  }

  /**
   * 获取持股比例
   * @private this.md5
   * @memberof HomeComponent
   */
  private searchShareHold() {
    this.homeService.searchShareHold(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data && data.data.biliInfo) {
          data.data.biliInfo = data.data.biliInfo.replace(/gudong_name/g, 'name').replace(/neighbour/g, 'children');
          this.shareHoldData = JSON.parse(data.data.biliInfo);
        }
      } else {
        this.snackBar.info(data.message);
      }
    });
  }

  /**
   * 获取投资分析
   * @private
   * @memberof HomeComponent
   */
  private searchInvRelation() {
    this.homeService.searchInvRelation(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (data.data && data.data.stocks && data.data.invests) {
          // data.data = JSON.parse(data.data);
          this.invRelationData = this.resetTree(data.data);
        }
      } else {
        this.snackBar.info(data.message);
      }
    });
  }

  /**
   * 获取风险分析
   *
   * @private
   * @memberof HomeComponent
   */
  private searchCourdoc() {
    this.homeService.searchCourdoc(this.key).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.courtPieAggList = [];
        this.courtLineAggList = [];
        data.data.aggList.forEach((item: any, index: number) => {
          if (Object.keys(item).length !== 0) {
            if (index === 0) {
              const pdata: any[] = [];
              _.forEach(item, (v, k) => { pdata.push({ name: k, value: v }); });
              this.courtPieAggList.push({ name: '', data: pdata });
            } else {
              const xdata: string[] = [];
              const ydata: number[] = [];
              _.forEach(item, (v: number, k: string) => { xdata.push(k); ydata.push(v); });
              this.courtLineAggList.push({ name: '', type: 'line', xData: xdata, yData: ydata });
            }
          }
        });
      }
    });
  }

  /**
   * 获取创新分析
   *
   * @private
   * @memberof HomeComponent
   */
  private searchPatent() {
    this.homeService.searchPatent(this.key).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.patentBarAggList = [];
        this.patentPieAggList = [];
        data.data.aggList.forEach((item: any, index: number) => {
          if (Object.keys(item).length !== 0) {
            if (index === 0  ) {
              const pdata: any[] = [];
              _.forEach(item, (v, k) => { pdata.push({ name: k, value: v }); });
              this.patentPieAggList.push({ name: '', data: pdata });
            } else {
            _.forEach(item, (data: any, index: number) => {
              const xdata: string[] = [];
              const ydata: number[] = [];
              _.forEach(data.buckets, (v: number, k: string) => { xdata.push(k); ydata.push(v); });
              this.patentBarAggList.push({
                name: data.key,
                type: 'bar',
                xData: xdata,
                yData: ydata
               });
              });
            }
          }
        });
      }
    });
  }

  /**
   * 获取软著分析
   *
   * @private
   * @memberof HomeComponent
   */
  private searchSoftRight() {
    this.homeService.searchSoftRight(this.key).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.softRightBarAggList = [];
        data.data.aggList.forEach((item: any, index: number) => {
          if (Object.keys(item).length !== 0) {
            if (index === 0) {
              const xdata: string[] = [];
              const ydata: number[] = [];
              _.forEach(item, (v: number, k: string) => { xdata.push(k); ydata.push(v); });
              this.softRightBarAggList.push({ name: '软著分析', type: 'bar', xData: xdata, yData: ydata });
            }
          }
        });
      }
    });
  }

  /**
   * 获取中标分析
   *
   * @private
   * @memberof HomeComponent
   */
  private searchBid() {
    this.homeService.searchBid(this.key).subscribe((data: any) => {
      this.bidPieAggList = [];
      this.bidMapAggList = [];
      if ('2000' === data.code) {
        data.data.aggList.forEach((item: any, index: number) => {
          if (Object.keys(item).length !== 0) {
            if (index === 0) {
              const pdata: any[] = [];
              _.forEach(item, (v, k) => { pdata.push({ name: k, value: v }); });
              this.bidPieAggList.push({ name: '', data: pdata });
            } else {
              this.formatMapData(item);
              this.mapTempData.sort((x, y) => (x.value > y.value ? -1 : 1));
              this.bidMapConfig.maxRange = this.mapdatamax;
              this.bidMapAggList.push({ name: '中标', data: this.mapTempData});
            }
          }
       });
      }
    });
  }

 // 地区数据初始化
 private initMapContainer() {
   _.forEach(this.provinces, (e) => {
    this.mapTempData.push({
       name: e,
       value: 0
     });
   });
 }


  // 格式化地图数据
  private formatMapData(data: any) {
    _.forEach(data, (value, key) => {
      _.forEach(this.mapTempData, (e) => {
        if (e.name === key) {
          e.value = value;
          this.mapdatamax = e.value > this.mapdatamax ? e.value : this.mapdatamax;
        }
      });
    });
  }

  /**
   * 用于企业订阅显示企业基本信息
   */
  private getCompanyEntity() {
    this.homeService.getCompanyDetail(this.md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.company = data.data;
      }
  });
  }
}
