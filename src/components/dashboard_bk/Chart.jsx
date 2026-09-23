// import React, { useEffect, useRef } from 'react';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   DoughnutController,
//   BarController,
//   LineController,
//   PieController,
// } from 'chart.js';

// // Register ALL controllers explicitly
// ChartJS.register(
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   DoughnutController,
//   BarController,
//   LineController,
//   PieController
// );

// const Chart = ({ type, data, options, className = '' }) => {
//   const canvasRef = useRef(null);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (canvasRef.current) {
//       chartRef.current = new ChartJS(canvasRef.current, {
//         type,
//         data,
//         options: {
//           responsive: true,
//           maintainAspectRatio: true,
//           ...options,
//         },
//       });
//     }
//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }
//     };
//   }, [type, data, options]);

//   return <canvas ref={canvasRef} className={className} />;
// };

// export default Chart;



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
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register ALL controllers and datalabels plugin
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
  // ChartDataLabels // Add this
);

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
        // plugins: [ChartDataLabels], // Add this
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