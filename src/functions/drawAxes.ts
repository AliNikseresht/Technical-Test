import * as d3 from "d3";
import { HEIGHT, MARGIN } from "src/libs/chartConstantValue";

export function drawAxes(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
) {
  svg
    .append("g")
    .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(yScale));
}
