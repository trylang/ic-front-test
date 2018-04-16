# 图表组件库

> Echarts， D3

## LineChart

### 1. example.module.ts

```ts
import { ChartModule } from '/path/tool/chart';

@NgModule({
  imports: [
    ChartModule
  ]
})
```

### 2. example.component.html

```html
  <div [configOption]="config" type="pie|bar|line|map" [onChartData]="data" arkChart></div>
```

Example:
data = [{
  name: 'test,
  xData: [],
  yData: []
}]

this.config = {
    title: 'test',
    yName: 'yName',
    xName: '',
    isAreaStyle: false,
    showLegend: false,
};
