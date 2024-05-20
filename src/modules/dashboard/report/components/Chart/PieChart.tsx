import { Paper, PaperProps } from '@mui/material'
import {
  ArcElement,
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
import { Doughnut } from 'react-chartjs-2'
import { chartColor, VehicleData } from '../../type'

type PieChartProps = PaperProps & {
  data: VehicleData
}

export default function PieChart({ data, ...props }: PieChartProps) {
  const [chartData, setChartData] = useState<ChartData<'doughnut'>>()

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  )

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Persentase Jumlah Kendaraan',
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
        },
      ],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Paper {...props}>
      {chartData && (
        <Doughnut data={chartData} options={options} id="pie-chart" />
      )}
    </Paper>
  )
}
