import { Paper, PaperProps } from '@mui/material'
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { chartColor, VehicleData } from '../../type'

type PieChartProps = PaperProps & {
  data: VehicleData
}

export default function BarChart({ data, ...props }: PieChartProps) {
  const [chartData, setChartData] = useState<ChartData<'bar'>>()

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarElement
  )

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Jumlah Kendaraan',
      },
    },
    layout: {
      padding: 24,
    },
  }

  useEffect(() => {
    setChartData({
      labels: ['Mobil', 'Motor', 'Truk'],
      datasets: [
        {
          data: [
            data.car.reduce((a, b) => a + b, 0),
            data.motorcycle.reduce((a, b) => a + b, 0),
            data.truck.reduce((a, b) => a + b, 0),
          ],
          backgroundColor: [
            chartColor.COLOR_1,
            chartColor.COLOR_2,
            chartColor.COLOR_3,
          ],
          indexAxis: 'y',
        },
      ],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Paper {...props}>
      {chartData && <Bar data={chartData} options={options} id="bar-chart" />}
    </Paper>
  )
}
