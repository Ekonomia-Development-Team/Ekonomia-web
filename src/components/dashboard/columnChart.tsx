"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// highcharts modules (drilldown) should be loaded on the client
// and may not export proper TS types, so we require them dynamically
if (typeof window !== "undefined") {
  // dynamically import the module in ESM-compatible way to avoid require() eslint rule
  import("highcharts/modules/drilldown").then((mod) => {
    type DrilldownFn = (highcharts: typeof Highcharts) => void;
    const modUnknown = mod as unknown;
    const Drilldown = ((modUnknown as { default?: DrilldownFn }).default) ?? (modUnknown as DrilldownFn | undefined);
    if (typeof Drilldown === "function") Drilldown(Highcharts);
  });
}

interface ColumnChartProps {
  title?: string;
  options?: Highcharts.Options;
  series?: Highcharts.SeriesOptionsType[];
  apiEndpoint?: string; // If provided, fetch series from API when series prop is not present
}


const ColumnChart: React.FC<ColumnChartProps> = ({ title, options, series, apiEndpoint }) => {
  const [fetchedSeries, setFetchedSeries] = useState<Highcharts.SeriesOptionsType[] | undefined>(series);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      if (!series && apiEndpoint) {
        try {
          const res = await fetch(apiEndpoint);
          if (!res.ok) throw new Error("Failed to fetch chart data");
          const data = await res.json();
          if (!cancelled) setFetchedSeries(data);
        } catch (_err) {
          // silently ignore for now, could add error state
          if (!cancelled) setFetchedSeries([]);
        }
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [series, apiEndpoint]);
  const defaultOptions: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: title ?? "Column Chart" },
    xAxis: { type: "category" },
    legend: { enabled: false },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y:.1f}%" },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },
    series: series ?? fetchedSeries ??
      [
        {
          name: "Browsers",
          type: "column",
          colorByPoint: true,
          data: [
            { name: "Chrome", y: 63.06, drilldown: "Chrome" },
            { name: "Safari", y: 19.84, drilldown: "Safari" },
            { name: "Firefox", y: 4.18, drilldown: "Firefox" },
            { name: "Edge", y: 4.12, drilldown: "Edge" },
            { name: "Opera", y: 2.33, drilldown: "Opera" },
            { name: "Internet Explorer", y: 0.45, drilldown: "Internet Explorer" },
            { name: "Other", y: 1.582 },
          ],
        },
      ],
    drilldown: {
      breadcrumbs: { position: { align: "right" } },
      series: [
        {
          name: "Chrome",
          type: "column",
          id: "Chrome",
          data: [
            ["v65.0", 0.1],
            ["v64.0", 1.3],
            ["v63.0", 53.02],
          ],
        },
        {
          type: "column",
          name: "Firefox",
          id: "Firefox",
          data: [
            ["v58.0", 1.02],
            ["v57.0", 7.36],
          ],
        },
      ],
    },
  };

  const merged = { ...defaultOptions, ...options };
  return <HighchartsReact highcharts={Highcharts} options={merged} />;
};

export default ColumnChart;