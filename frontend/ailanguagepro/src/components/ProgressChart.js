import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ recordHistory }) => {
  if (!recordHistory || recordHistory.length === 0) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#6B6B63',
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.9rem'
      }}>
        No practice data available yet
      </div>
    );
  }

  // Sort records by timestamp
  const sortedRecords = [...recordHistory]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const labels = sortedRecords.map((_, index) => `Session ${index + 1}`);
  const scores = sortedRecords.map(record => record.score);

  const data = {
    labels,
    datasets: [
      {
        label: 'Pronunciation Score',
        data: scores,
        borderColor: '#CC785C',
        backgroundColor: 'rgba(204, 120, 92, 0.08)',
        borderWidth: 3.5,
        pointBackgroundColor: '#CC785C',
        pointBorderColor: '#F7F3EA',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#CC785C',
        pointHoverBorderColor: '#F7F3EA',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.35
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1B1B18',
        titleColor: '#EDE6D6',
        bodyColor: '#EDE6D6',
        borderColor: 'rgba(204, 120, 92, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
        titleFont: {
          family: 'Georgia, serif',
          weight: 'bold',
          size: 13
        },
        bodyFont: {
          family: '"IBM Plex Mono", monospace',
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `Score: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B6B63',
          font: {
            family: '"IBM Plex Mono", monospace',
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(27, 27, 24, 0.06)',
          borderDash: [3, 3]
        },
        ticks: {
          color: '#6B6B63',
          font: {
            family: '"IBM Plex Mono", monospace',
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '220px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ProgressChart;


