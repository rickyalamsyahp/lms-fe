import { Paper, PaperProps } from '@mui/material'
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { chartColor, VehicleData } from '../../type'

type LineChartProps = PaperProps & {
  data: VehicleData
  time: string[]
}

export default function LineChart({ data, time, ...props }: LineChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'>>()

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  )

  const options = {
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: 4,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Jumlah Kendaraan Harian',
      },
    },
    layout: {
      padding: 24,
    },
  }

  useEffect(() => {
    setChartData({
      labels: [...time],
      datasets: [
        {
          label: 'Mobil',
          data: data.car,
          backgroundColor: chartColor.COLOR_1,
          borderColor: chartColor.COLOR_1,
          tension: 0.1,
        },
        {
          label: 'Motor',
          data: data.motorcycle,
          backgroundColor: chartColor.COLOR_2,
          borderColor: chartColor.COLOR_2,
          tension: 0.1,
        },
        {
          label: 'Truk',
          data: data.truck,
          backgroundColor: chartColor.COLOR_3,
          borderColor: chartColor.COLOR_3,
          tension: 0.1,
        },
      ],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Paper {...props}>
      {chartData && <Line data={chartData} options={options} id="line-chart" />}
    </Paper>
  )
}
