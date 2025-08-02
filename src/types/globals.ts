export type SingleSeriesPoint = [number, number | null];
export type MultiSeriesPoint = [
  number,
  [number | null, number | null, number | null]
];
export type ChartData = {
  title: string;
  data: (SingleSeriesPoint | MultiSeriesPoint)[];
};
