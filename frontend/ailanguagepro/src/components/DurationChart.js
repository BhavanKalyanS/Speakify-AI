import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DurationChart = ({ recordHistory }) => {
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
        No duration data available yet
      </div>
    );
  }

  // Sort records by timestamp
  const sortedRecords = [...recordHistory]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const labels = sortedRecords.map((_, index) => `Session ${index + 1}`);
  const durations = sortedRecords.map(record => record.duration || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Practice Duration (s)',
        data: durations,
        backgroundColor: '#CC785C',
        borderRadius: 4,
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
            return `Duration: ${context.parsed.y}s`;
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
            return value + 's';
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '220px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DurationChart;
