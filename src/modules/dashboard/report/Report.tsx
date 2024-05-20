import { faker } from '@faker-js/faker'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import BarChart from './components/Chart/BarChart'
import LineChart from './components/Chart/LineChart'
import PieChart from './components/Chart/PieChart'
import { VehicleData } from './type'

export default function Report() {
  const [isReady, setIsReady] = useState(false)
  const [time, setTime] = useState<string[]>([])
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    car: [],
    motorcycle: [],
    truck: [],
  })

  useEffect(() => {
    const __time: string[] = []
    for (let i = 0; i < 30; i++) {
      __time.push(dayjs().add(-1, 'M').add(i, 'day').format('DD MMM'))
    }

    const __vehicleData: VehicleData = {
      car: __time.map(() => faker.number.int({ min: 500, max: 2000 })),
      motorcycle: __time.map(() => faker.number.int({ min: 500, max: 5000 })),
      truck: __time.map(() => faker.number.int({ min: 10, max: 1000 })),
    }

    setTime([...__time])
    setVehicleData({ ...__vehicleData })
    setIsReady(true)
  }, [])
  return (
    <Box maxWidth="lg" sx={{ width: '100%', margin: '0 auto' }}>
      {isReady && (
        <Stack sx={{ flex: 1, gap: 1 }} flexDirection={'row'} flexWrap={'wrap'}>
          <PieChart
            data={vehicleData}
            sx={{ flex: 'none', width: 480, height: 480 }}
          />
          <BarChart data={vehicleData} sx={{ flex: 1, height: 480 }} />
          <LineChart
            data={vehicleData}
            time={time}
            sx={{ flex: 'none', width: '100%', height: 480 }}
          />
        </Stack>
      )}
    </Box>
  )
}
