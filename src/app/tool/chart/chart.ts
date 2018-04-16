import { Directive, ElementRef, Renderer2, Input, OnDestroy } from '@angular/core';
import { ECharts, EChartOption } from 'echarts';
import 'echarts/map/js/china.js';
import { ChartOption } from './chart.model';
import { ChartData } from './chart-data';
import { debug } from 'util';

@Directive({
  selector: '[arkChart]'
})
export class ChartDirective implements OnDestroy {
  private config: ChartOption; // 图表配置参数
  private chartData: ChartData[]; // 图表数据
  private dom: HTMLDivElement|HTMLCanvasElement; // 图表DIV
  private listener: EventListener; // resize监听器
  private chart: any; // 图表实例
  private lineColorList: string[]; // color list
  private PieColorList: string[]; // color list
  private legends: string[] = []; // 图例标签数组
  @Input() public type: string;
  @Input()
  set configOption(config: ChartOption) {
    this.config = config;
    if (this.config) {
      this.initDom();
    }
  }

  @Input()
  set onChartData(data: ChartData[]) {
    if (Array.isArray(data)) {
      this.chartData = data;
      if (data && data.length > 0) {
        this.initChart();
      } else {
        console.warn('数据为空');
      }
    } else {
      console.warn('数据格式不对');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.PieColorList = ['#72afc1', '#5596a5', '#4793a0', '#468d9e', '#4f9daf', '#61a4af', '#42a3ba', '#4b9caf', '#5b9ba5', '#5b94a5'];
    this.lineColorList = ['#19d096', '#ff6b5a', '#1bb5e2', '#dbc845', '#55d4d7', '#4e79b7', '#ffad00', '#b8554b', '#ce6d16'];
  }


  public ngOnDestroy() {
    this.onToggleListener(false);
  }

  private initDom() {
    this.dom = this.renderer.createElement('div');
    this.renderer.appendChild(this.el.nativeElement, this.dom);
    this.renderer.setStyle(this.dom, 'width', `${this.el.nativeElement.clientWidth}px`);
    this.renderer.setStyle(this.dom, 'height', '300px');
    this.chart = echarts.init(this.dom);
  }

  private initOption() {
    if ('pie' === this.type) {
      return {
        title: {
          text: this.config.title || '',
          left: 'center'
        },
        tooltip : {
          trigger: 'item',
          position: 'inside',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 40,
          bottom: 60,
          data: this.legends
        },
        series: this.formatSerise(this.chartData) || [],
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      };
    }
    if ('line' === this.type || 'bar' === this.type) {
      return {
        title: {
          text: this.config.title || '',
          left: 'center'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 40,
          bottom: 60,
          data: this.legends
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '14%',
          containLabel: true
        },
        dataZoom: [{
          startValue: 0,
          left: 'center',
          width: this.config.ZoomWidth,
        }, {
          type: 'inside'
        }],
        xAxis: [{
          type: 'category',
          boundaryGap : this.config.boundaryGap,
          name: this.config.xName || '',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            }
          },
          data: this.chartData[0].xData
        }],
        yAxis: [{
          type: 'value',
          name: this.config.yName || '',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ccc',
              type: 'solid' // solid, dashed, dotted
            }
          }
        }],
        series: this.formatSerise(this.chartData) || []
      };
    }
    if ('map' === this.type) {
      return  {
        title: {
          text: this.config.title || '',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}%'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 40,
          bottom: 60,
          data: this.legends,
          textStyle: {
            color: '#423e34'
          }
        },
        visualMap: [{
          min: 0,
          max: this.config.maxRange || 2500,
          left: 'right',
          top: 'bottom',
          text: ['高', '低'],           // 文本，默认为数值文本
          calculable: true,
          // color: ['#28668c', '#86cde9']
          inRange: {
            color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        }],
        series: this.formatSerise(this.chartData) || []
      };
    }
  }

   /**
    * 格式化数据
    *
    * @private
    * @param {ChartData[]} data
    * @returns
    * @memberof PieDirective
    */
  private formatSerise(data: ChartData[]) {
    if (data && Array.isArray(data)) {
      data.forEach((e: ChartData, i: number) => {
        e.type = this.type;
        if ('pie' === this.type) {
          e.radius = e.radius || '55%';
          e.center = e.center || ['50%', '70%'];
          e.avoidLabelOverlap = false;
          if (this.config.showLegend === true) {
            e.data = e.data.sort((x, y) => (x.value > y.value ? -1 : 1));
            e.data.forEach((item: any, index: number) => {
              if (index < this.config.topNum) {
                this.legends.push(item.name);
              }
              item.itemStyle = {
                normal: {
                  color: this.lineColorList[index % 8] // 赋值颜色或默认颜色
                }
              };
            });
          }
          e.label = {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
          };
        }
        if ('line' === this.type || 'bar' === this.type) {
          if ('bar' === this.type) {
            e.barWidth = '30%';
          }
          if (this.config.isAreaStyle === true) {
            e.stack = 'sameType';
            e.areaStyle = {normal: {}};
          }
          if (this.config.showLegend === true) {
            this.legends.push(e.name);
          }
          e.itemStyle = {
            normal: {
              color: e.itemColor || this.lineColorList[i % 8] // 赋值颜色或默认颜色
            }
          };
        }
        if ('map' === this.type) {
          e.mapType = 'china';
          e.label = {
            normal: {
              show: true
            },
            emphasis: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          };
          e.itemStyle = {
            normal: {
              borderColor: '#389BB7',
              areaColor: '#fff',
              color: e.itemColor || '#f7bb1b' // 赋值颜色或默认颜色
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          };
          if (this.config.showLegend === true) {
            this.legends.push(e.name);
          }
        }
        e.data = ('line' === this.type || 'bar' === this.type) ? e.yData : e.data;
      });
      return data;
    } else {
      return [];
    }
  }

  /**
   * 初始化图表
   *
   * @private
   */
  private initChart() { // option: EChartOption
    this.onSetOption(this.initOption());
    this.onToggleListener(true);
  }

  /**
   * set option
   * @param {EChartOption} option
   */
  private onSetOption(option: EChartOption) {
    this.chart.showLoading();
    this.chart.setOption(option);
    this.chart.hideLoading();
  }

  /**
   * add/remove resize listener
   *
   * @private
   * @param {boolean} add
   * @memberof LineDirective
   */
  private onToggleListener(add: boolean) {
    function handler() {
      this.renderer.setStyle(this.dom, 'width', this.el.nativeElement.clientWidth);
      this.chart.resize();
    }
    if (add) {
      window.addEventListener('resize', handler.bind(this), false);
    } else {
      window.removeEventListener('resize', handler.bind(this), false);
    }
  }
}
