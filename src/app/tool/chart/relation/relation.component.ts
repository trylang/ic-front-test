import { Component, AfterViewInit, ElementRef, Renderer2, Input, Output, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as util from './util';

@Component({
  selector: 'ark-chart-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelationComponent implements AfterViewInit {
  public showChart: boolean = false;
  private _DELAY_ = 0;
  private _DURATION_ = 1000;
  private _PLUSPATH_ = util.plusPath(1.5, 5);
  private _MINUSPATH_ = util.minusPath(2, 5);

  private svg: any;
  private g: any;
  private gu: any;
  private gd: any;
  private tree: any;
  private chartData: any;

  @Input()
  set onChartData(data: any) {
    // 每次获取到数据，重绘图表
    if (data) {
      this.showChart = true;
      this.svg = null;
      this.g = null;
      this.gu = null;
      this.gd = null;
      this.tree = null;
      this.chartData = null;

      if (!this.svg) {
        this.initDom();
      }

      data = this.formatD3Data(data);

      data.renderDir = (dataTmp: any) => {
        this.initChart(dataTmp, this.g);
      };
      this.initRenderChart(data);

      this.initStratify(data);
    }
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  public ngAfterViewInit() {
    // this.initDom();
  }

  // init step
  // 1. init dom
  // 2. init chart
  // 3. init stratity

  /**
   * 1. init chart dom
   *
   * @private
   * @memberof RelationComponent
   */
  private initDom() {
    const viewerHeight: number = window.screen.height > 800 ? 800 : window.screen.height;

    if (d3.select('#chartContainer').selectAll('svg')) {
      d3.selectAll('svg').remove();
    }

    this.svg = d3
      .select('#chartContainer')
      .append('svg')
      .attr('width', 1120)
      .attr('height', viewerHeight);

    const width = +this.svg.attr('width');
    const height = +this.svg.attr('height');
    this.g = this.svg.append('g');
    this.gd = this.g.append('g');
    this.gu = this.g.append('g');

    d3.select('circle').attr('r', 10);
    this.g.attr('transform', `translate(${width / 2},${height / 2}) scale(1) rotate(0)`);

    this.tree = d3
      .tree()
      .size([360, height / 2 * 0.6])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    util.initMouseListener(this.g);
  }

  /**
   * 格式化D3数据格式
   *
   * @private
   * @param {{name: string; children: any[]; }} data
   * @returns {*}
   * @memberof RelationComponent
   */
  private formatD3Data(data: { name: string; children: any[] }): any {
    util.traverse(data);
    for (const i in data.children) {
      if (data.children.hasOwnProperty(i)) {
        data.children[i].index = i;
      }
    }
    const hierachy: any = d3.hierarchy(data, function children(d) {
      // var children = d.children;
      // delete d.children;
      return d.children;
    });
    const toggleChild = (data: any) => {
      if (data.depth > 1) {
        const children = data.children;
        data._children = children;
        delete data.children;
      }
    };
    const nodes = hierachy.descendants();
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        toggleChild(nodes[i]);
      }
    }
    hierachy.extendMode = true;

    return hierachy;
  }

  private initRenderChart(data: any) {
    for (const i in data.descendants()) {
      if (data.descendants().hasOwnProperty(i)) {
        data.descendants()[i].data._x = 0;
        data.descendants()[i].data._y = 0;
      }
    }
    this.initChart(data, this.g);
  }

  /**
   * 初始化图表
   *
   * @private
   * @param {*} data
   * @memberof RelationComponent
   */
  private initChart(data: any, g: any) {
    // init do
    const extendMode = data.extendMode;
    const elength = 150;

    data = util.initDataAction(data, g);

    const root = this.tree(util.remapEmptyTree(data));
    util.removeNousedNode(root);

    const foldByLayer = function(layer: any) {
      const node = this;
      data.each((d: any) => {
        d.data._x = d.x;
        d.data._y = extendMode ? elength * d.depth : d.y;
      });
      const dt = node.descendants();
      const toggle = (elem: any) => {
        if (elem.depth > layer - 1) {
          if (elem.hasOwnProperty('children')) {
            const children = elem.children;
            elem._children = children;
            delete elem.children;
          }
        } else {
          if (elem.hasOwnProperty('_children')) {
            const children = elem._children;
            elem.children = children;
            delete elem._children;
          }
        }
      };
      for (const i in dt) {
        if (dt.hasOwnProperty(i)) {
          toggle(dt[i]);
        }
      }
      root.renderDir(data);
    };

    // const initChart = this.initChart;
    const onClick = function(self: any) {
      const node = this;
      if (node.parent !== null) {
        if (node.parent.data.name !== '高管成员') {
          if (node.data.companyId) {
            // do
          } else {
            if (node.data.company_id) {
              // scope.nodeClick({
              //   node: node.data.company_id
              // });
            }
            data.each((d: any) => {
              d.data._x = d.x;
              d.data._y = extendMode ? elength * d.depth : d.y;
            });
            if (node.hasOwnProperty('children')) {
              const clone = node.children;
              node._children = clone;
              delete node.children;
            } else if (node.hasOwnProperty('_children')) {
              const clone = node._children;
              node.children = clone;
              delete node._children;
            }
            // if (typeof scope.ngModel.render === 'function') {
            //   scope.ngModel.render(data, node);
            // }
            // if (typeof scope.ngModel.renderLegend === 'function') {
            //   scope.ngModel.renderLegend(data);
            // }

            // init chart
            self.initChart(data, g);
          }
        }
      }
    };

    data.each((element: any) => {
      element.onClick = onClick;
      element.foldByLayer = foldByLayer;
    });
    this.chartData = data; // init chart data

    const xPosition = (d: any) => {
      const str = d.data.name;
      const num = util.calculateStr(str);
      if (extendMode) {
        if (d.x < 180) {
          return 16;
        } else {
          return -16 - num;
        }
      } else {
        return d.x < 180 === !d.children ? 16 : -16 - num;
      }
    };
    const yPosition = (d: any) => {
      return !d.children ? 0 : -20;
    };

    const link = this.gd.selectAll('.link').data(root.descendants().slice(1), (d: any) => d.data.id);
    link
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .tween('attr.d', function(d: any) {
        const ox = d.data._x;
        const oy = d.data._y;
        const opx = d.parent.data._x;
        const opy = d.parent.data._y;
        const px = d.parent.x;
        const py = extendMode ? d.parent.depth * elength : d.parent.y;
        const x = d.x;
        const y = extendMode ? d.depth * elength : d.y;
        const node = this;
        const i = d3.interpolate([ox, oy, opx, opy], [x, y, px, py]);

        return (t: any) => {
          this.setAttribute('d', util.renderLink(i(t)[0], i(t)[1], i(t)[2], i(t)[3]));
        };
      });

    const linkEnter = link.enter();
    linkEnter
      .append('path')
      .attr('class', 'link')
      .style('pointer-events', 'none')
      .style('stroke', util.fillColor)
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .tween('attr.d', function(d: any) {
        let opx = 0;
        let opy = 0;

        if (d.parent !== null) {
          opx = d.parent.data._x;
          opy = d.parent.data._y;
        }
        const x = d.x;
        const y = extendMode ? d.depth * elength : d.y;
        const px = d.parent.x;
        const py = extendMode ? d.parent.depth * elength : d.parent.y;
        const node = this;
        const i = d3.interpolate([opx, opy, opx, opy], [x, y, px, py]);
        const opacity = d3.interpolate(0, 1);

        return (t: any) => {
          node.setAttribute('d', util.renderLink(i(t)[0], i(t)[1], i(t)[2], i(t)[3]));
          node.setAttribute('opacity', opacity(t));
        };
      });

    const linkExit = link.exit();
    linkExit
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => {
        const maxDepth = util.getMaxDepth(root.descendants().slice(1));
        return this._DELAY_ * (maxDepth - d.depth + 2);
      })
      .tween('attr.d', function(d: any) {
        const ox = d.data._x;
        const oy = d.data._y;
        const opx = d.parent.data._x;
        const opy = d.parent.data._y;
        const px = d.parent.x;
        const py = extendMode ? d.parent.depth * elength : d.parent.y;
        const node = this;
        const i = d3.interpolate([ox, oy, opx, opy], [px, py, px, py]);

        return (t: any) => {
          node.setAttribute('d', util.renderLink(i(t)[0], i(t)[1], i(t)[2], i(t)[3]));
        };
      })
      .remove();

    const node = this.gu.selectAll('.node').data(root.descendants(), (d: any) => d.data.id);
    node
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .attr('transform', (d: any) => {
        const y = extendMode ? d.depth * elength : d.y;
        return `translate(${util.project(d.x, y)})`;
      });
    node.selectAll('path').attr('d', (d: any) => {
      if (d.parent !== null) {
        if (d._children) {
          return this._PLUSPATH_;
        } else if (d.children) {
          return this._MINUSPATH_;
        }
      }
    });
    node
      .selectAll('rect')
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .attr('transform', (d: any) => `rotate(${d.x < 180 ? d.x - 90 : d.x + 90})`)
      .attr('x', (d: any) => (d.x < 180 === !d.children ? 0 : -100))
      .style('text-anchor', 'start');
    node
      .selectAll('text')
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .attr('transform', (d: any) => `rotate(${d.x < 180 ? d.x - 90 : d.x + 90})`)
      .attr('x', xPosition)
      .attr('y', yPosition)
      .style('text-anchor', 'start');

    const nodeEnter = node.enter().append('g');
    nodeEnter
      .on('mouseover', function(d: any) {
        if (d.parent) {
          if (d.parent.data.name !== '高管成员') {
            const node = d3.select(this);
            node.selectAll('text').style('fill', '#333');
            node.selectAll('text').style('font-weight', 'bold');
            node.selectAll('circle').style('opacity', 0.5);
          }
        }
      })
      .on('mouseout', function(d: any) {
        if (d.parent) {
          if (d.parent.data.name !== '高管成员') {
            const node = d3.select(this);
            node.selectAll('text').style('fill', '#777');
            node.selectAll('text').style('font-weight', 'normal');
            node.selectAll('circle').style('opacity', 1);
          }
        }
      })
      .on('click', (d: any) => {
        if (d.parent) {
          if (d.parent.data.name !== '高管成员') {
            d.onClick(this);
          }
        }
      })
      .attr('class', (d: any) => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .style('opacity', 0)
      .style('cursor', 'pointer')
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => this._DELAY_ * d.depth)
      .tween('attr.transform', function(d: any) {
        let px;
        let py;

        if (d.parent !== null) {
          px = d.parent.data._x;
          py = d.parent.data._y;
        } else {
          px = 0;
          py = 0;
        }
        const x = d.x;
        const y = extendMode ? d.depth * elength : d.y;
        const node = this;
        const i = d3.interpolate([px, py], [x, y]);
        const opacity = d3.interpolate(0, 1);

        return (t: any) => {
          node.setAttribute('transform', `translate(${util.project(i(t)[0], i(t)[1])})`);
          node.style.opacity = opacity(t);
        };
      });
    nodeEnter
      .append('rect')
      .attr('width', 100)
      .attr('height', 30)
      .attr('x', (d: any) => (d.x < 180 === !d.children ? 0 : -100))
      .attr('y', -15)
      .attr('transform', (d: any) => `rotate(${d.x < 180 ? d.x - 90 : d.x + 90})`)
      .attr('fill', 'rgba(250,250,250,0)');
    nodeEnter
      .append('circle')
      .attr('r', (d: any) => {
        const maxDepth = util.getMaxDepth(root.descendants().slice(1));
        return 2 + (maxDepth - d.depth + 1) * 2;
      })
      .attr('stroke', util.fillColor)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 8)
      .style('fill', util.fillColor);
    nodeEnter
      .append('path')
      .attr('d', (d: any) => {
        if (d.parent !== null) {
          if (d._children) {
            return this._PLUSPATH_;
          } else if (d.children) {
            return this._MINUSPATH_;
          }
        }
      })
      .style('fill', '#fff');
    nodeEnter
      .append('text')
      .attr('dy', '.31em')
      .attr('x', xPosition)
      .attr('y', yPosition)
      .style('pointer-events', 'none')
      .style('text-anchor', 'start')
      .attr('transform', (d: any) => `rotate(${d.x < 180 ? d.x - 90 : d.x + 90})`)
      .text((d: any) => d.data.name.substring(d.data.name.lastIndexOf('.') + 1));
    const nodeExit = node.exit();
    nodeExit
      .transition()
      .duration(this._DURATION_)
      .delay((d: any) => {
        const maxDepth = util.getMaxDepth(root.descendants().slice(1));
        return this._DELAY_ * (maxDepth - d.depth + 2);
      })
      .tween('attr.transform', function(d: any) {
        const px = d.parent.x;
        const py = extendMode ? d.parent.depth * elength : d.parent.y;
        const x = d.x;
        const y = extendMode ? d.depth * elength : d.y;
        const node = this;
        const i = d3.interpolate([x, y], [px, py]);

        return (t: any) => {
          node.setAttribute('transform', `translate(${util.project(i(t)[0], i(t)[1])})`);
          node.style.opacity = 1 - t;
        };
      })
      .remove();
  }

  private initStratify(root: any) {
    $('#stratify').empty();
    const wrap = $('<div></div>').addClass('row');
    $('#stratify').append(wrap);

    function addChild(data: any) {
      const col = $('<div></div>').addClass('col-md-6');
      const table = $('<table></table>');
      const tr = $('<tr></tr>');
      const td1 = $('<td></td>').css('width', 80);
      const td2 = $('<td></td>').css('width', 200);
      const span = $('<span></span>').text(data.data.name);
      const change = function() {
        const layer = Number($(this).val()) + 1;
        data.foldByLayer(layer);
      };
      const select = $('<select></select>')
        .addClass('form-control')
        .on('change', change);
      const addOption = (index: any) => {
        const option = $('<option></option>')
          .text(`第${index}层`)
          .attr('value', index);
        return option;
      };
      for (let i = 1; i < 5; i++) {
        select.append(addOption(i));
      }
      select.val(1);

      td1.append(span);
      td2.append(select);
      tr.append(td1);
      tr.append(td2);
      table.append(tr);
      col.append(table);
      return col;
    }
    for (const i in root.children) {
      if (root.children.hasOwnProperty(i)) {
        wrap.append(addChild(root.children[i]));
      }
    }
  }
}
