/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
  Assignment,
  Download,
  People,
  School,
  TrendingUp,
  Visibility,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useSession } from '../../../context/session'

export default function AdminDashboard() {
  const { state } = useSession()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [onlineStudents, setOnlineStudents] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
    fetchOnlineStudents()
    fetchRecentActivities()

    // Refresh online students every 30 seconds
    const interval = setInterval(fetchOnlineStudents, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      setDashboardData(data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchOnlineStudents = async () => {
    try {
      const response = await fetch('/api/admin/online-students')
      const data = await response.json()
      setOnlineStudents(data.data)
    } catch (error) {
      console.error('Failed to fetch online students:', error)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities?limit=10')
      const data = await response.json()
      setRecentActivities(data.data)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const downloadUserCredentials = async () => {
    try {
      const response = await fetch('/api/admin/download-credentials')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `user-credentials-${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download credentials:', error)
    }
  }

  const stats = [
    {
      title: 'Total Siswa',
      value: dashboardData?.totalStudents || 0,
      icon: <People />,
      color: 'primary.main',
    },
    {
      title: 'Total Guru',
      value: dashboardData?.totalTeachers || 0,
      icon: <School />,
      color: 'secondary.main',
    },
    {
      title: 'Ujian Aktif',
      value: dashboardData?.activeExams || 0,
      icon: <Assignment />,
      color: 'success.main',
    },
    {
      title: 'Siswa Online',
      value: onlineStudents.length,
      icon: <Visibility />,
      color: 'info.main',
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Admin
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography color="text.secondary">{stat.title}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Online Students */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Siswa Online</Typography>
                <Chip
                  label={`${onlineStudents.length} online`}
                  color="success"
                  size="small"
                />
              </Box>

              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {onlineStudents.map((student: any) => (
                  <Box
                    key={student.id}
                    sx={{ p: 1, borderBottom: '1px solid #eee' }}
                  >
                    <Typography variant="body2">
                      {student.student?.nama}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.questionBank?.title} •{' '}
                      {new Date(student.loginTime).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aktivitas Terbaru
              </Typography>

              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {recentActivities.map((activity: any) => (
                  <Box
                    key={activity.id}
                    sx={{ p: 1, borderBottom: '1px solid #eee' }}
                  >
                    <Typography variant="body2">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.userType} •{' '}
                      {new Date(activity.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aksi Cepat
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={downloadUserCredentials}
                >
                  Download User & Password
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  onClick={() =>
                    window.open('/dashboard/admin/exams', '_blank')
                  }
                >
                  Kelola Ujian
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() =>
                    window.open('/dashboard/admin/users', '_blank')
                  }
                >
                  Kelola User
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  onClick={() =>
                    window.open('/dashboard/admin/reports', '_blank')
                  }
                >
                  Laporan
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
