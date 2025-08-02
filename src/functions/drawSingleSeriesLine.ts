import * as d3 from "d3";
import { COLORS } from "src/libs/chartConstantValue";

export function drawSingleSeriesLine(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  data: [number, number][],
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>
) {
  const line = d3
    .line<[number, number]>()
    .defined((d) => d[1] !== null)
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", COLORS[0])
    .attr("stroke-width", 2)
    .attr("d", line);
}
