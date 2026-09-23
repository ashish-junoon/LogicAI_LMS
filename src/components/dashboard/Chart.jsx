import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  BarController,
  LineController,
  PieController,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  BarController,
  LineController,
  PieController,
);

// Ledger theme defaults (light) — every chart on the dashboard
// inherits this palette unless a page explicitly overrides it.
ChartJS.defaults.color = '#5B6B7A';
ChartJS.defaults.borderColor = '#E8EBEE';
ChartJS.defaults.font.family =
  "'IBM Plex Mono', ui-monospace, monospace";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.plugins.tooltip.backgroundColor = '#16202B';
ChartJS.defaults.plugins.tooltip.titleColor = '#FFFFFF';
ChartJS.defaults.plugins.tooltip.bodyColor = '#DCE1E6';
ChartJS.defaults.plugins.tooltip.borderColor = '#16202B';
ChartJS.defaults.plugins.tooltip.borderWidth = 0;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.displayColors = false;
ChartJS.defaults.plugins.tooltip.cornerRadius = 2;

const Chart = ({ type, data, options, className = '' }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      chartRef.current = new ChartJS(canvasRef.current, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          ...options,
        },
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} className={className} />;
};

export default Chart;
