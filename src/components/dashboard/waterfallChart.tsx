import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Waterfall from "highcharts/modules/waterfall";

if (typeof Waterfall === "function") Waterfall(Highcharts);

interface WaterfallChartProps {
  title?: string;
  series?: Highcharts.SeriesOptionsType[];
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ title, series }) => {
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
    series: series ?? defaultSeries,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default WaterfallChart;