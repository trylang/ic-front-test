export interface ChartData {
  name: string;
  data: any[];
  xData: number[];
  yData: number[];
  mapType: string;

  itemColor?: string;
  barWidth?: string;
  type?: string;
  label?: {};
  stack?: string;
  radius?: string | number[];
  center?: string | string[];
  itemStyle?: string | {};
  areaStyle?: {};
  avoidLabelOverlap?: boolean;
  cursor?: string;
  gird?: any;
  left?: string;
}
