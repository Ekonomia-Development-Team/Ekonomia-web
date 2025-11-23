"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

if (typeof window !== "undefined") {
  import("highcharts/modules/variable-pie").then((mod) => {
    const modUnknown = mod as unknown;
    type VarPieFn = (h: typeof Highcharts) => void;
    const VariablePie = ((modUnknown as { default?: VarPieFn }).default) ?? (modUnknown as VarPieFn | undefined);
    if (typeof VariablePie === "function") VariablePie(Highcharts);
  });
}

interface PieChartProps {
  title?: string;
  series?: Highcharts.SeriesOptionsType[];
  apiEndpoint?: string;
}

const PieChart: React.FC<PieChartProps> = ({ title, series, apiEndpoint }) => {
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
      type: "variablepie",
      name: "countries",
      minPointSize: 10,
      innerSize: "20%",
      zMin: 0,
      borderRadius: 5,
      data: [
        { name: "Spain", y: 505992, z: 95 },
        { name: "France", y: 551695, z: 118 },
        { name: "Poland", y: 312679, z: 131 },
        { name: "Czech Republic", y: 78865, z: 136 },
        { name: "Italy", y: 301336, z: 198 },
        { name: "Switzerland", y: 41284, z: 224 },
        { name: "Germany", y: 357114, z: 238 },
      ],
      colors: ["#4caefe", "#3dc3e8", "#2dd9db", "#1feeaf", "#0ff3a0", "#00e887", "#23e274"],
    },
  ];

  const options: Highcharts.Options = {
    chart: { type: "variablepie" },
    title: { text: title ?? "Countries compared by population density and total area, 2024" },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "Area (square km): <b>{point.y}</b><br/>" +
        "Population density (people per square km): <b>{point.z}</b><br/>",
    },
    series: series ?? fetchedSeries ?? defaultSeries,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;