'use client'

import { Download } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import DataTable from '../../../components/shared/DataTable'

export default function ActivityLog() {
  const [activities, setActivities] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(25)
  const [search, setSearch] = useState('')
  const [userType, setUserType] = useState('')
  const [activityType, setActivityType] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchActivities()
  }, [page, size, search, userType, activityType, dateRange])

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        search,
        userType,
        activityType,
        startDate: dateRange.start,
        endDate: dateRange.end,
      })

      const response = await fetch(`/api/admin/activities?${params}`)
      const data = await response.json()
      setActivities(data.data)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const downloadActivities = async () => {
    try {
      const params = new URLSearchParams({
        search,
        userType,
        activityType,
        startDate: dateRange.start,
        endDate: dateRange.end,
        format: 'excel',
      })

      const response = await fetch(`/api/admin/activities/download?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `activity-log-${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download activities:', error)
    }
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'login':
        return 'info'
      case 'logout':
        return 'default'
      case 'exam_start':
        return 'primary'
      case 'exam_submit':
        return 'success'
      case 'exam_auto_submit':
        return 'warning'
      case 'exam_reopen':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      label: 'Waktu',
      render: (item: any) => (
        <Typography variant="body2">
          {new Date(item.createdAt).toLocaleString('id-ID')}
        </Typography>
      ),
    },
    {
      label: 'User',
      render: (item: any) => (
        <Box>
          <Typography>{item.userId}</Typography>
          <Chip label={item.userType} size="small" variant="outlined" />
        </Box>
      ),
    },
    {
      label: 'Aktivitas',
      render: (item: any) => (
        <Box>
          <Chip
            label={item.activity.replace('_', ' ').toUpperCase()}
            color={getActivityColor(item.activity)}
            size="small"
          />
        </Box>
      ),
    },
    {
      label: 'Deskripsi',
      render: (item: any) => (
        <Typography variant="body2">{item.description}</Typography>
      ),
    },
    {
      label: 'IP Address',
      render: (item: any) => (
        <Typography variant="body2" fontFamily="monospace">
          {item.ipAddress || '-'}
        </Typography>
      ),
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Log Aktivitas
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              label="Pencarian"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tipe User</InputLabel>
              <Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                label="Tipe User"
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="student">Siswa</MenuItem>
                <MenuItem value="teacher">Guru</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Aktivitas</InputLabel>
              <Select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                label="Aktivitas"
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
                <MenuItem value="exam_start">Mulai Ujian</MenuItem>
                <MenuItem value="exam_submit">Submit Ujian</MenuItem>
                <MenuItem value="exam_reopen">Buka Ulang Ujian</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Dari Tanggal"
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Sampai Tanggal"
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadActivities}
            >
              Download
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <DataTable
        data={activities}
        loading={!activities}
        columns={columns}
        paginationProps={{
          rowsPerPageOptions: [10, 25, 50, 100],
          rowsPerPage: size,
          count: activities.length,
          page,
          onPageChange: (e, value) => setPage(value + 1),
          onRowsPerPageChange: (e) => {
            setSize(Number(e.target.value))
            setPage(1)
          },
        }}
      />
    </Box>
  )
}
