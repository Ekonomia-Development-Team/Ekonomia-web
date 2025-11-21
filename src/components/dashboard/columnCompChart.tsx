"use client";

import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

/*
  Modelo sugerido (opções que este componente aceita)

  - Opção A (Highcharts-ready):
    Passe `series` já formatado como Highcharts.SeriesOptionsType[].
    {
      series: [
        { name: "2024", type: "column", data: [{ name: "kr", y: 13, color: "#FE2371" }, ...] },
        ...
      ]
    }

  - Opção B (compact data-by-year):
    Passe `data` como mapa year -> Array<[key, value]> e `countries` com metadados.
    {
      countries: { kr: { name: "South Korea", color: "#FE2371" }, ... },
      data: {
        2024: [["kr", 13], ["jp", 20], ...],
        2020: [["kr", 6], ["jp", 27], ...]
      },
      activeYear: 2024
    }

  O componente prioriza `series` quando fornecido; caso contrário gera séries a partir de `data`.
*/

interface CountryMeta {
  name: string;
  color?: string;
  ucCode?: string;
  [k: string]: any;
}

interface ColumnCompChartProps {
  countries?: Record<string, CountryMeta>;
  data?: Record<number, Array<[string, number]>>;
  getData?: (
    data: Array<[string, number]>,
    countries?: Record<string, CountryMeta>
  ) => Highcharts.PointOptionsObject[];
  activeYear?: number; // ex: 2024
  title?: string;
  series?: Highcharts.SeriesOptionsType[]; // Highcharts-ready override
}

const ColumnCompChart: React.FC<ColumnCompChartProps> = ({
  countries,
  data,
  getData,
  activeYear = new Date().getFullYear(),
  title,
  series,
}) => {

  const localCountries = useMemo(() => {
    const c: Record<string, CountryMeta> = {};
    if (!countries) return c;
    Object.entries(countries).forEach(([k, v]) => {
      c[k] = { ...v, ucCode: (v.ucCode ?? k).toUpperCase() };
    });
    return c;
  }, [countries]);

  const defaultGetData = (d: Array<[string, number]>, c = localCountries) =>
    d.map(([key, val]) => ({
      name: key,
      y: val,
      color: c[key]?.color,
    }));

  const computedSeries = useMemo<Highcharts.SeriesOptionsType[] | null>(() => {
    
    if (series && series.length > 0) return series;

    
    if (!data) return null;

    
    const prevYear = activeYear - 4;
    const prevData = data[prevYear] ?? [];
    const activeData = data[activeYear] ?? [];

    return [
      {
        color: "rgba(158, 159, 163, 0.5)",
        pointPlacement: -0.2,
        linkedTo: "main",
        
        data: prevData.slice(),
        name: String(prevYear),
        type: "column" as const,
      },
      {
        name: String(activeYear),
        id: "main",
        dataSorting: { enabled: true, matchByName: true },
        
        data: (getData ?? defaultGetData)(activeData, localCountries).slice(),
        dataLabels: [{ enabled: true, inside: true, style: { fontSize: "16px" } }],
        type: "column" as const,
      },
    ];
  }, [series, data, activeYear, getData, localCountries]);

 
  if (!computedSeries) {
    return <div style={{ padding: 12, color: "#666" }}>Nenhum dado fornecido para o gráfico.</div>;
  }

  const options: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: title ?? `Comparison ${activeYear}`, align: "left" },
    plotOptions: { series: { grouping: false, borderWidth: 0 } },
    legend: { enabled: false },
    tooltip: { shared: true },
    xAxis: {
      type: "category",
      accessibility: { description: "Categories" },
      max: 4,
      labels: {
        useHTML: true,
        animate: true,
        format: "{chart.options.countries.(value).ucCode}<br>",
        style: { textAlign: "center" },
      },
    },
    yAxis: [{ title: { text: "Value" }, showFirstLabel: false }],
    series: computedSeries,
    countries: localCountries,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ColumnCompChart;