import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'ark-chart-entity-relation',
  templateUrl: './entity-relation.component.html',
  styleUrls: ['./entity-relation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EntityRelationComponent implements AfterViewInit {

  @Input()
  set onChartData(data: any) {
    if (data) {
      this.initChart(data);
    }
  }
  // constructor() { }

  public ngAfterViewInit() {
    this.initDom();
  }

  private initDom() {
    // TODO: seperate init dom code
  }

  private initChart(data: any) {
    // D3图表的JSON数据
    const JsonData = data;

    // size of the diagram
    const viewerWidth: number = 1600;
    const viewerHeight: number = window.screen.height > 800 ? 800 : window.screen.height;
    d3.selectAll('svg').remove();
    const svg = d3
      .select('#tree-container')
      .append('svg')
      .attr('width', viewerWidth)
      .attr('height', viewerHeight)
      .attr('class', 'overlay');

    const chart = svg.append('g').attr('transform', 'translate(260,0)');

    const tree = d3.tree();
    tree.size([viewerHeight, viewerWidth - 500]);

    // render
    const root = d3.hierarchy(JsonData, (d: any) => d.children);
    root.sum((d: any) => d.value).sort((a, b) => b.value - a.value);
    tree(root);

    chart
      .selectAll('.link')
      .data(root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`);

    const node = chart
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', (d: any) => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    node.append('circle').attr('r', 5.5);

    node
      .append('text')
      .attr('dy', 3)
      .attr('dx', (d: any) => (d.children ? -16 : 16))
      .style('text-anchor', (d: any) => (d.children ? 'end' : 'start'))
      .text((d: any) => (d.data.percent ? `${d.data.name} (${Number(d.data.percent * 100).toFixed(2)}%)` : `${d.data.name}`));

    // 点击节点进行显示隐藏字节点
    const nodeEnter = node
      .enter()
      .append('svg:g')
      .attr('class', 'node')
      // .attr('transform', function(d) {
      //   return translate
      // })
      .on('click', (d: any) => {
        // toggleNode(d);
        // updateChart(d);
      });

    nodeEnter
      .append('svg:circle')
      .attr('r', 8)
      .style('fill', (d: any) => (d._children ? 'lightsteelblue' : '#fff'));

    // nodeEnter.append('svg:text')
    //   .attr()

    /**
     * 切换节点的合开
     *
     * @param {any} d
     */
    function toggleNode() {
      // do something
    }

    /**
     * 更新视图
     *
     * @param {any} d
     */
    function updateChart() {
      // do something
    }

    // 缩放和平移拖拽
    const zoomListener = d3
      .zoom()
      .scaleExtent([0.3, 5])
      .duration(550)
      .on('zoom', zoom);

    svg.call(zoomListener).on('dblclick.zoom', null);

    function zoom() {
      chart.attr('transform', d3.event.transform);
    }
  }
}
