import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Drilldown from "highcharts/modules/drilldown";

if (typeof Drilldown === "function") Drilldown(Highcharts);

interface ColumnChartProps {
  title?: string;
  options?: Highcharts.Options;
  series?: Highcharts.SeriesOptionsType[];
}


const ColumnChart: React.FC<ColumnChartProps> = ({ title, options, series }) => {
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
    series:
      series ??
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
            { name: "Other", y: 1.582, drilldown: null },
          ],
        },
      ],
    drilldown: {
      breadcrumbs: { position: { align: "right" } },
      series: [
        {
          name: "Chrome",
          id: "Chrome",
          data: [
            ["v65.0", 0.1],
            ["v64.0", 1.3],
            ["v63.0", 53.02],
          ],
        },
        {
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