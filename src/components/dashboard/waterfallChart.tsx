"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

if (typeof window !== "undefined") {
  import("highcharts/modules/waterfall").then((mod) => {
    const modUnknown = mod as unknown;
    type WFFn = (h: typeof Highcharts) => void;
    const Waterfall = ((modUnknown as { default?: WFFn }).default) ?? (modUnknown as WFFn | undefined);
    if (typeof Waterfall === "function") Waterfall(Highcharts);
  });
}

interface WaterfallChartProps {
  title?: string;
  series?: Highcharts.SeriesOptionsType[];
  apiEndpoint?: string;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ title, series, apiEndpoint }) => {
  const [fetchedSeries, setFetchedSeries] = useState<Highcharts.SeriesOptionsType[] | undefined>(series);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      if (!series && apiEndpoint) {
        try {
          const res = await fetch(apiEndpoint);
          if (!res.ok) throw new Error("Failed to fetch chart data");
          const d = await res.json();
          if (!cancelled) setFetchedSeries(d);
        } catch (_err) {
          if (!cancelled) setFetchedSeries([]);
        }
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [series, apiEndpoint]);
  const defaultSeries: Highcharts.SeriesOptionsType[] = [
    {
      type: "waterfall",
      upColor: Highcharts.getOptions().colors?.[2],
      color: Highcharts.getOptions().colors?.[3],
      data: [
        { name: "Start", y: 120000 },
        { name: "Product Revenue", y: 569000 },
        { name: "Service Revenue", y: 231000 },
        { name: "Positive Balance", isIntermediateSum: true, color: Highcharts.getOptions().colors?.[1] },
        { name: "Fixed Costs", y: -342000 },
        { name: "Variable Costs", y: -233000 },
        { name: "Balance", isSum: true, color: Highcharts.getOptions().colors?.[1] },
      ],
      dataLabels: { enabled: true, format: "{divide y 1000}k" },
      pointPadding: 0,
    },
  ];

  const options: Highcharts.Options = {
    chart: { type: "waterfall" },
    title: { text: title ?? "Highcharts Waterfall" },
    xAxis: { type: "category" },
    yAxis: { title: { text: "USD" } },
    legend: { enabled: false },
    tooltip: { pointFormat: '<b>${point.y:,.2f}</b> USD' },
    series: series ?? fetchedSeries ?? defaultSeries,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default WaterfallChart;