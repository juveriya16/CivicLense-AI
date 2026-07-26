import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { weeklyActivity } from '../../mock/data'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function WeeklyActivityChart() {
  const data = {
    labels: weeklyActivity.labels,
    datasets: [
      {
        label: 'Submitted',
        data: weeklyActivity.reportsSubmitted,
        backgroundColor: '#ff6b2c',
        borderRadius: 8,
        barThickness: 14,
      },
      {
        label: 'Resolved',
        data: weeklyActivity.reportsResolved,
        backgroundColor: '#16233f',
        borderRadius: 8,
        barThickness: 14,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', color: '#4b5670', font: { size: 11, family: 'Inter' } },
      },
      tooltip: { backgroundColor: '#10192e', padding: 10, cornerRadius: 10 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#4b5670', font: { size: 11 } } },
      y: { beginAtZero: true, grid: { color: '#e4e8f1' }, ticks: { color: '#4b5670', font: { size: 11 }, stepSize: 1 } },
    },
  }

  return (
    <div style={{ height: 220 }}>
      <Bar data={data} options={options} />
    </div>
  )
}
