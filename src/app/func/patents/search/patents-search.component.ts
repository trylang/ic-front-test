import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatentsServer } from '../service/patents.service';
import { Title } from '@angular/platform-browser';

import * as echarts from 'echarts';
import 'echarts/map/js/china.js';
import * as _ from 'lodash';

import { HeadList, seaData } from '../patents-data-type-model';
import { QueryParam } from './query-param.model';

@Component({
  templateUrl: './patents-search.component.html',
  styleUrls: ['./patents-search.component.scss']
})
export class PatentsSearchComponents implements OnInit {
  public recdata: any;
  public looding: boolean;
  public groupdata: any;
  public totalRecords: number = 0;
  public page: number;
  public sortdata: string[];
  public graphdata: object[];
  public currentPage: number = 1;
  public queryParam: QueryParam;
  public provinces: string[];

  constructor(private router: Router, private route: ActivatedRoute, private patentsserver: PatentsServer, private titleService: Title) {
    this.recdata = '';
    const title = this.titleService.getTitle();
    this.titleService.setTitle('专利搜索' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.queryParam = new QueryParam();
    this.getProvince();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.currentPage = +params['page'] || 1;
      this.queryParam.dateRange = +params['dateRange'] || null;
      this.queryParam.key = params['key'] || null;
      this.queryParam.page = params['page'] || null;
      this.queryParam.patentType = params['patentType'] || null;
      this.queryParam.province = params['province'] || null;
      this.queryParam.sort = params['sort'] || null;

      this.Getdata({
        option: 6,
        key: this.queryParam.key || '工业机器人',
        page: this.queryParam.page || 1,
        patentType: this.queryParam.patentType,
        dateRange: this.queryParam.dateRange,
        province: this.queryParam.province,
        sort: !+this.queryParam.sort ? null : this.queryParam.sort
      });
    });

    this.graphdata = [
      {
        titles: [],
        numbers: [],
        data: []
      },
      {
        titles: [],
        numbers: [],
        data: []
      },
      {
        titles: [],
        numbers: [],
        data: []
      },
      {
        titles: [],
        numbers: [],
        data: []
      }
    ];

    this.sortdata = ['默认排序', '申请日升序', '申请日降序', '公开日升序', '公开日降序'];
  }

  // 获取专利数据
  public Getdata(data?: any, key?: number): void {
    this.looding = true;
    this.patentsserver.patentsSearch('/search/ic_patent', data).subscribe((data: any) => {
      if (data.code) {
        this.looding = false;
      }
      if ('2000' === data.code) {
        this.recdata = data.data;
        this.totalRecords = this.recdata.size;
        this.Fngraph(data.data.aggList);
      }
    });
  }

  public redirectToDetail(md5: string) {
    const param: any = {
      md5
    };

    if (this.queryParam.key) {
      param.key = this.queryParam.key;
    }
    this.router.navigate(['/patents/detail'], {
      queryParams: param
    });
  }

  // 图表
  public Fngraph(data: any): void {
    data.forEach((val: any, ind: number) => {
      if (ind) {
        this.graphdata[ind - 1]['titles'] = [];
        this.graphdata[ind - 1]['numbers'] = [];
        this.graphdata[ind - 1]['data'] = [];
        _.forEach(val, (indj, valj: any) => {
          if (valj !== '外观设计' && ind !== 4) {
            this.graphdata[ind - 1]['titles'].push(valj);
            this.graphdata[ind - 1]['numbers'].push(indj);
            this.graphdata[ind - 1]['data'].push({ name: valj, value: indj });
          }
        });
      }
    });
    this.graphdata[3]['data'] = [
      { name: '云南', value: 0 },
      { name: '安徽', value: 0 },
      { name: '北京', value: 0 },
      { name: '福建', value: 0 },
      { name: '甘肃', value: 0 },
      { name: '广西', value: 0 },
      { name: '海南', value: 0 },
      { name: '河北', value: 0 },
      { name: '黑龙江', value: 0 },
      { name: '河南', value: 0 },
      { name: '湖北', value: 0 },
      { name: '湖南', value: 0 },
      { name: '江苏', value: 0 },
      { name: '吉林', value: 0 },
      { name: '辽宁', value: 0 },
      { name: '宁夏', value: 0 },
      { name: '青海', value: 0 },
      { name: '山东', value: 0 },
      { name: '上海', value: 0 },
      { name: '山西', value: 0 },
      { name: '天津', value: 0 },
      { name: '新疆', value: 0 },
      { name: '西藏', value: 0 },
      { name: '西藏', value: 0 },
      { name: '广东', value: 0 },
      { name: '重庆', value: 0 },
      { name: '浙江', value: 0 },
      { name: '四川', value: 0 },
      { name: '贵州', value: 0 },
      { name: '内蒙古', value: 0 },
      { name: '陕西', value: 0 },
      { name: '江西', value: 0 },
      { name: '台湾', value: 0 },
      { name: '南海诸岛', value: 0 }
    ];
    _.forEach(this.graphdata[3]['data'], (item: any, ind: any) => {
      _.forEach(data[4], (items: any, inds: any) => {
        if (item.name === inds) {
          item.value = items;
        }
      });
    });
    const objs = this.graphdata[0]['data'];
    const userdatakeys = Object.keys(objs).sort((a: any, b: any) => objs[a]['value'] - objs[b]['value']);
    const uservalues = [] as any[];
    const usertitles = [] as any[];
    _.forEach(userdatakeys, indj => {
      uservalues.push(this.graphdata[0]['numbers'][indj]);
      usertitles.push(this.graphdata[0]['titles'][indj]);
    });

    this.Fncanvasgraph('.goods-graph-user', {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: 'left',
        right: '4%',
        bottom: '3%',
        top: '0',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLabel: {
            color: '#777'
          },
          axisLine: {
            lineStyle: {
              color: ['skyblue']
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#eee']
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisLabel: {
            show: false,
            formatter() {
              return '';
            }
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: ['#eee']
            }
          },
          data: usertitles,
          nameTextStyle: {
            fontSize: 0
          }
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '80%',
          cursor: 'default',
          data: uservalues
        }
      ]
    });
    this.Fncanvasgraph('.goods-graph-trend', {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['专利数量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        data: this.graphdata[1]['titles'],
        axisLabel: {
          color: '#777',
          rotate: 12
        },
        axisLine: {
          lineStyle: {
            color: ['skyblue']
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#skyblue']
          }
        }
      },
      yAxis: {
        axisLabel: {
          color: '#777'
        },
        axisLine: {
          lineStyle: {
            color: ['skyblue']
          }
        }
      },
      series: [
        {
          type: 'bar',
          cursor: 'default',
          data: this.graphdata[1]['numbers']
        }
      ]
    });
    this.Fncanvasgraph('.goods-graph-pie', {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        data: this.graphdata[2]['titles']
      },
      series: [
        {
          name: '专利分布',
          cursor: 'default',
          type: 'pie',
          radius: ['40%', '70%'],
          color: ['#6abae3', '#3aa4da'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '14'
              }
            }
          },
          data: this.graphdata[2]['data']
        }
      ]
    });
    this.Fncanvasgraph('.goods-graph-address', {
      graphic: {
        elements: [
          {
            type: 'group',
            cursor: 'default'
          }
        ]
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        min: 0,
        max: this.graphdata[3]['data'].map((e: any) => e.value).reduce((prev: number, curr: number) => curr > prev ? curr : prev),
        left: '0',
        top: 'bottom',
        text: ['高', '低'],
        inRange: {
          color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [
        {
          name: '专利数量(个)',
          type: 'map',
          map: 'china',
          roam: false,
          data: this.graphdata[3]['data'],
          markPoint: {
            symbolSize: 0
          }
        }
      ]
    });
  }
  // 分页按钮
  public paginate(paginator: any) {
    const page = paginator.page + 1;

    this.router.navigate(['/patents/search'], {
      queryParamsHandling: 'merge',
      queryParams: {
        page
      }
    });

    this.scrollTop();
  }

  private scrollTop() {
    window.scroll(0, 0);
  }

  // 列表搜索|排重
  public FnShowSelect() {
    const goodsShowMsg = document.querySelector('.goods-show-msg');
    const goodsShowState = document.querySelector('.goods-show-state');
    const goodsSelectList = document.querySelector('.goods-select-list');
    goodsShowMsg.classList.remove('goods-show-checked');
    goodsShowState.classList.remove('fa-chevron-down');
    goodsShowState.classList.add('fa-chevron-up');
    goodsSelectList.classList.add('goods-show-checked');
  }
  public FnState() {
    const goodsShowState = document.querySelector('.goods-show-state');
    const goodsShowMsg = document.querySelector('.goods-show-msg');
    const goodsSelectList = document.querySelector('.goods-select-list');
    if (goodsShowState.classList.contains('fa-chevron-up')) {
      goodsShowMsg.classList.add('goods-show-checked');
      goodsShowState.classList.add('fa-chevron-down');
      goodsShowState.classList.remove('fa-chevron-up');
      goodsSelectList.classList.remove('goods-show-checked');
    } else {
      goodsShowMsg.classList.remove('goods-show-checked');
      goodsShowState.classList.remove('fa-chevron-down');
      goodsShowState.classList.add('fa-chevron-up');
      goodsSelectList.classList.add('goods-show-checked');
    }
  }

  public FnMore(ind?: any) {
    const moreIcon = document.querySelector('.more-icon') as HTMLElement;
    const moreUl = document.querySelector('.single-ul-' + ind) as HTMLElement;
    if (moreIcon.classList.contains('fa-chevron-up')) {
      moreIcon.classList.remove('fa-chevron-up');
      moreIcon.classList.add('fa-chevron-down');
      moreUl.classList.remove('more');
    } else {
      moreIcon.classList.remove('fa-chevron-down');
      moreIcon.classList.add('fa-chevron-up');
      moreUl.classList.add('more');
    }
  }

  private Fncanvasgraph(eleclass: string, option: object) {
    setTimeout(() => {
      const goodsGraph = document.querySelector(eleclass) as HTMLCanvasElement;
      if (goodsGraph) {
        const goodsGraphs = echarts.init(goodsGraph);
        goodsGraphs.setOption(option);
      }
    }, 100);
  }

  private getProvince() {
    this.patentsserver.getProvince().subscribe((data: any) => {
      this.provinces = data.provinces;
    });
  }
}
