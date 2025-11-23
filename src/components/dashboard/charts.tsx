"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface chartsProps {
  titulo: string;
  seriesData?: Highcharts.SeriesOptionsType[];
  apiEndpoint?: string; // opcional, usado se seriesData não for passado
  categories?: string[];
}

const MeuGraficoDeBarras: React.FC<chartsProps> = ({
  titulo,
  seriesData,
  apiEndpoint,
  categories = [],
}) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: { text: titulo },
    series: seriesData ?? [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(!seriesData && !!apiEndpoint);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      if (seriesData) {
        setChartOptions((prev) => ({
          ...prev,
          chart: { type: "bar" },
          title: { text: titulo },
          xAxis: { categories },
          yAxis: { title: { text: "Unidades Vendidas" } },
          series: seriesData,
        }));
        setIsLoading(false);
        return;
      }

      if (!apiEndpoint) {
        // fallback vazio
        setChartOptions({
          chart: { type: "bar" },
          title: { text: titulo },
          xAxis: { categories },
          yAxis: { title: { text: "Unidades Vendidas" } },
          series: [],
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Falha ao buscar dados da API");
        const dataSeries = await response.json();
        setChartOptions({
          chart: { type: "bar" },
          title: { text: titulo },
          xAxis: { categories },
          yAxis: { title: { text: "Unidades Vendidas" } },
          series: dataSeries,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchChartData();
  }, [titulo, seriesData, apiEndpoint, categories]);

  if (isLoading) return <div>Carregando gráfico...</div>;
  if (error) return <div>Erro ao carregar dados: {error}</div>;

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default MeuGraficoDeBarras;