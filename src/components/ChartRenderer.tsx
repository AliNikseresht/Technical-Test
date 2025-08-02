import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type {
  ChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "src/types/globals";
import { drawAxes } from "src/functions/drawAxes";
import { drawSingleSeriesLine } from "src/functions/drawSingleSeriesLine";
import { drawMultiSeriesLines } from "src/functions/drawMultiSeriesLines";
import { HEIGHT, MARGIN, WIDTH } from "src/libs/chartConstantValue";

type Props = {
  chart: ChartData;
};

export function ChartRenderer({ chart }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chart?.data || chart.data.length === 0) return;

    if (
      !Array.isArray(chart.data[0]) ||
      chart.data[0].length !== 2 ||
      (!Array.isArray(chart.data[0][1]) &&
        typeof chart.data[0][1] !== "number" &&
        chart.data[0][1] !== null)
    ) {
      return;
    }

    const isMultiSeries = Array.isArray(chart.data[0][1]);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .style("border", "1px solid #ccc");

    if (!isMultiSeries) {
      const singleData = chart.data as SingleSeriesPoint[];
      const filteredData = singleData.filter((d) => d[1] !== null) as [
        number,
        number
      ][];
      if (filteredData.length === 0) return;

      const x = d3
        .scaleLinear()
        .domain(d3.extent(singleData, (d) => d[0]) as [number, number])
        .range([MARGIN.left, WIDTH - MARGIN.right]);

      const y = d3
        .scaleLinear()
        .domain([
          Math.min(0, d3.min(filteredData, (d) => d[1])!),
          d3.max(filteredData, (d) => d[1])!,
        ])
        .range([HEIGHT - MARGIN.bottom, MARGIN.top])
        .nice();

      drawSingleSeriesLine(svg, filteredData, x, y);
      drawAxes(svg, x, y);
    } else {
      const multiData = chart.data as MultiSeriesPoint[];
      const timestamps = multiData.map((d) => d[0]);
      const allValues = multiData
        .flatMap((d) => d[1])
        .filter((v) => v !== null) as number[];
      if (allValues.length === 0) return;

      const x = d3
        .scaleLinear()
        .domain(d3.extent(timestamps) as [number, number])
        .range([MARGIN.left, WIDTH - MARGIN.right]);

      const y = d3
        .scaleLinear()
        .domain([Math.min(0, d3.min(allValues)!), d3.max(allValues)!])
        .range([HEIGHT - MARGIN.bottom, MARGIN.top])
        .nice();

      drawMultiSeriesLines(svg, multiData, x, y);
      drawAxes(svg, x, y);
    }
  }, [chart]);

  if (
    !chart.data ||
    chart.data.length === 0 ||
    !Array.isArray(chart.data[0]) ||
    chart.data[0].length !== 2 ||
    (!Array.isArray(chart.data[0][1]) &&
      typeof chart.data[0][1] !== "number" &&
      chart.data[0][1] !== null)
  ) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{chart.title}</h2>
        <p className="text-red-500">Invalid or empty chart data</p>
      </div>
    );
  }

  const isMultiSeries = Array.isArray(chart.data[0][1]);
  if (
    isMultiSeries &&
    !(chart.data as MultiSeriesPoint[]).some((d) =>
      d[1].some((v) => v !== null)
    )
  ) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{chart.title}</h2>
        <p className="text-red-500">No valid series data to display</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{chart.title}</h2>
      <svg ref={svgRef} role="img" aria-label={`${chart.title} chart`}></svg>
    </div>
  );
}
