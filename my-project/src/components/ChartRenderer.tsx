import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ChartData } from "src/types/globals";

type Props = {
  chart: ChartData;
};

export default function ChartRenderer({ chart }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chart?.data || chart.data.length === 0) {
      return;
    }

    if (!Array.isArray(chart.data[0]) || chart.data[0].length !== 2) {
      console.warn("Invalid chart format", chart);
      return;
    }

    const isMultiSeries = Array.isArray(chart.data[0][1]);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clean before drawing

    svg
      .attr("width", 600)
      .attr("height", 300)
      .style("border", "1px solid #ccc");

    if (!isMultiSeries) {
      const singleData = chart.data as [number, number | null][];

      const filteredData = singleData.filter((d) => d[1] !== null) as [
        number,
        number
      ][];

      const width = 600;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const x = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, (d) => d[0]) as [number, number])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, (d) => d[1]) as [number, number])
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<[number, number]>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      svg
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    } else if (isMultiSeries) {
      const multiData = chart.data as [
        number,
        [number | null, number | null, number | null]
      ][];

      const width = 600;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const timestamps = multiData.map((d) => d[0]);

      const allValues = multiData
        .flatMap((d) => d[1])
        .filter((v) => v !== null) as number[];

      const x = d3
        .scaleLinear()
        .domain(d3.extent(timestamps) as [number, number])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(allValues) as [number, number])
        .range([height - margin.bottom, margin.top]);

      const colors = ["blue", "green", "red"];

      for (let i = 0; i < 3; i++) {
        const lineData: [number, number][] = multiData
          .filter((d) => Array.isArray(d[1]) && d[1][i] !== null)
          .map((d) => [d[0], d[1][i] as number]);

        const line = d3
          .line<[number, number]>()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]));

        svg
          .append("path")
          .datum(lineData)
          .attr("fill", "none")
          .attr("stroke", colors[i])
          .attr("stroke-width", 2)
          .attr("d", line);
      }

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    }
  }, [chart]);

  if (!chart.data || chart.data.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{chart.title}</h2>
        <p className="text-red-500">No valid data to display.</p>
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
