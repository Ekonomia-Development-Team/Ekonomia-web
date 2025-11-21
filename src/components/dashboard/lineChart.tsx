import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

/*
  Modelo sugerido (exemplo A - category-based)

  interface ChartSeries {
    name: string;
    type?: 'line' | 'spline' | 'area' | 'areaspline';
    data: number[]; // alinhado com `categories`
    color?: string;
    [key: string]: any;
  }

  interface LineChartPayload {
    categories?: string[]; // ex: ["Jan","Feb","Mar","Apr"]
    series: ChartSeries[];  // listas de valores (mesma ordem das categories)
    meta?: { timezone?: string; unit?: string };
  }

  Exemplo A (category-based):
  {
    "categories": ["Jan","Feb","Mar","Apr"],
    "series": [
      { "name": "Gastos", "type": "line", "data": [120, 150, 90, 200], "color": "#FF6B6B" },
      { "name": "Receitas", "type": "line", "data": [200, 180, 160, 220], "color": "#4CAF50" }
    ]
  }
*/

interface LineChartProps {
  title?: string;
  categories?: string[];
  series?: Highcharts.SeriesOptionsType[];
}

const defaultPayload = {
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  series: [
    {
      name: "Gastos",
      type: "line",
      data: [120, 150, 90, 200, 180, 160],
      color: "#FF6B6B",
    },
    {
      name: "Receitas",
      type: "line",
      data: [200, 180, 160, 220, 210, 190],
      color: "#4CAF50",
    },
  ],
} as const;

const LineChart: React.FC<LineChartProps> = ({ title, categories, series }) => {
  const usedCategories = categories ?? defaultPayload.categories;
  const usedSeries = series ?? (defaultPayload.series as Highcharts.SeriesOptionsType[]);

  const options: Highcharts.Options = {
    chart: { type: "line" },
    title: { text: title ?? "Line Chart" },
    xAxis: { categories: usedCategories },
    yAxis: { title: { text: "Value" } },
    plotOptions: {
      line: { dataLabels: { enabled: true }, enableMouseTracking: true },
    },
    series: usedSeries,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;