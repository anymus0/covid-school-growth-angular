interface ChartFormat {
  name: string;
  value: number;
}

export interface BarChartFormat {
  name: string;
  value: number;
}

export interface AreaChartFormat {
  name: string;
  series: Array<ChartFormat>;
}
