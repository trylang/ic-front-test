import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MacroServer } from '../service/macro.service';
import { reqDatas, wrapDatas, recDatas } from '../macro-type';


@Component({
  selector: 'macro-content',
  templateUrl: './macro-content.component.html',
  styleUrls: ['../macro-common.component.css', './macro-content.component.scss']
})
export class MacroContentComponent implements OnInit {
  public severdata: any;
  public severDetaily: any;
  public reqDatas: reqDatas;
  public wrapDatas: wrapDatas;
  public JSONdata: any | any[];
  public title: string;
  public groupData: [{
    cursor: string, name: string, xData: any[], yData: any[],
    type?: string
  }];
  public groupOption: {
    title: string, yName: string, xName: string, isAreaStyle: boolean,
    showLegend: boolean, boundaryGap: boolean, ZoomWidth: number | string
  };
  constructor(
    private macroServer: MacroServer,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.severdata = '';
    // 数据图表的初始化
    this.groupData = [{
      name: '',
      xData: [],
      yData: [],
      type: '',
      cursor: 'default',
    }];
    this.groupOption = {
      title: '',
      yName: '',
      xName: '',
      ZoomWidth: '',
      boundaryGap: true,
      isAreaStyle: false,
      showLegend: false,
    };
  }
  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.reqDatas = {
        id: this.route.snapshot.queryParams['id'],
        title: this.route.snapshot.queryParams['title']
      };
      this.wrapDatas = {
        tapArr: ['checked', '', ''],
        type: 'bar',
        pdzhi: 'ture',
        selectind: 0,
        oneGroup: [],
        twoGroup: []
      };
      if (this.reqDatas.id) {
        this.getdata('GET', '/kpi/getDetailByBase', {
          baseId: this.reqDatas.id
        });
      } else {
        this.getdata('GET', '/kpi/getBasicInfo');
      }

    });
  }
  // 获取数据
  public getdata(type: string, url: string, data?: any): void {
    this.macroServer.FnMacros(type, url, data).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.FnUseData(data.data);
      }
    });
  }
  // 数据处理函数
  public FnUseData(data?: any, type?: string): void {
    if (this.wrapDatas.pdzhi === 'ture') {
      this.severdata = data;
      this.JSONdata = JSON.parse(this.severdata.entity.detail);
      this.wrapDatas.twoGroup = [this.JSONdata[0].t, this.JSONdata[this.JSONdata.length - 1].t,
      this.severdata.entity.freq, this.severdata.entity.region, this.severdata.entity.unit];
    } else {
      this.severDetaily = data;
      this.JSONdata = JSON.parse(this.severDetaily.detail);
      this.wrapDatas.twoGroup = [this.JSONdata[0].t, this.JSONdata[this.JSONdata.length - 1].t,
      this.severDetaily.freq, this.severDetaily.region, this.severDetaily.unit];
    }
    this.FnRemove();
    this.wrapDatas.xData = [];
    this.wrapDatas.yData = [];
    for (const item of this.JSONdata) {
      this.wrapDatas.xData.push(this.FnTime(item.t, 4));
      this.wrapDatas.yData.push(item.v);
    }
    this.FnGroup();
  }
  // 顶部tap切换
  public FnTapBtn(key?: number, type?: string): void {
    this.wrapDatas.tapArr = ['', '', ''];
    this.wrapDatas.tapArr[key] = 'checked';
    this.wrapDatas.type = type;
    if (type !== 'table') {
      this.FnRemove();
      this.FnGroup();
    }
  }
  // select选择
  public FnChange(event: Event, ind: number) {
    const nowEvent = event.target as HTMLSelectElement;
    this.wrapDatas.oneGroup = [this.severdata.regions[0], this.severdata.freqs[0]];
    this.wrapDatas.pdzhi = 'false';
    this.wrapDatas.selectind = nowEvent.selectedIndex;
    this.wrapDatas.oneGroup[ind] = nowEvent.options[this.wrapDatas.selectind].value;
    this.getdata('GET', '/kpi/getSpecificDetail', {
      baseId: this.reqDatas.id || this.severdata.baseId,
      region: this.wrapDatas.oneGroup[0],
      freq: this.wrapDatas.oneGroup[1]
    });
  }
  // 绘制图表
  public FnGroup(): void {
    this.groupData = [{
      name: '',
      xData: this.wrapDatas.xData,
      yData: this.wrapDatas.yData,
      type: this.wrapDatas.type,
      cursor: 'default',
    }];
    this.groupOption = {
      title: '',
      yName: '',
      xName: '',
      ZoomWidth: '70%',
      boundaryGap: true,
      isAreaStyle: false,
      showLegend: false,
    };
  }
  // 重绘图表
  public FnRemove(): void {
    if (document.querySelector('.graph-group')) {
      const graphGroup = document.querySelector('.graph-group');
      graphGroup.innerHTML = '';
    }
  }
  // 时间处理函数
  public FnTime(value: string, YYpdzhi?: number): any {
    let yyyy = '';
    let MM = '';
    let dd = '';
    const values = value as string;
    if (values) {
      yyyy = values.slice(0, YYpdzhi) + '年';
      if (values.length >= YYpdzhi + 2) {
        MM = values.slice(YYpdzhi, YYpdzhi + 2) + '月';
      }
      if (values.length >= YYpdzhi + 4) {
        dd = values.slice(YYpdzhi + 2, YYpdzhi + 4) + '日';
      }
      return yyyy + MM + dd;
    }
  }
}

