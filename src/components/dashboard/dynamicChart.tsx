"use client";

import React from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';

interface ChartProps {
  type: 'bar' | 'pie' | 'line';
  title: string;
  apiEndpoint: string; // ex: '/charts/sales-data'
  // ... outras props como 'id'
}

const DynamicChart: React.FC<ChartProps> = ({ type, title, apiEndpoint }) => {
  
  switch (type) {
    case 'bar':
      return <BarChart title={title} apiEndpoint={apiEndpoint} />;
    
    case 'pie':
      return <PieChart title={title} apiEndpoint={apiEndpoint} />;
    
    case 'line':
      return <LineChart title={title} apiEndpoint={apiEndpoint} />;
    
    // 3. Tenha um caso padrão
    default:
      return <div>Tipo de gráfico desconhecido: {type}</div>;
  }
};

export default DynamicChart;