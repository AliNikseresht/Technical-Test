import * as d3 from "d3";
import { COLORS } from "src/libs/chartConstantValue";
import type { MultiSeriesPoint } from "src/types/globals";

export function drawMultiSeriesLines(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  data: MultiSeriesPoint[],
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>
) {
  for (let i = 0; i < 3; i++) {
    const lineData: [number, number | null][] = data.map((d) => [
      d[0],
      d[1][i],
    ]);

    const line = d3
      .line<[number, number | null]>()
      .defined((d) => d[1] !== null)
      .x((d) => x(d[0]))
      .y((d) => y(d[1] as number));

    svg
      .append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", COLORS[i])
      .attr("stroke-width", 2)
      .attr("d", line);
  }
}
