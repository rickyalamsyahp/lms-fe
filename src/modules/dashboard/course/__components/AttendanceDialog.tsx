import { Download } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import DataTable from '../../../../components/shared/DataTable'

function AttendanceDialog({ open, onClose, examId }: any) {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && examId) {
      fetchAttendance()
    }
  }, [open, examId])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/exam-attendance/${examId}`)
      const data = await response.json()
      setAttendance(data.data)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadAttendance = () => {
    // Implementation for downloading attendance as Excel
    const link = document.createElement('a')
    link.href = `/api/exam-attendance/${examId}/download`
    link.download = `attendance_${examId}.xlsx`
    link.click()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Daftar Hadir Ujian</Typography>
          <Button onClick={downloadAttendance} startIcon={<Download />}>
            Download
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            data={attendance}
            loading={loading}
            columns={[
              {
                label: 'Nama Siswa',
                render: (item: any) => (
                  <Typography>{item.student?.nama}</Typography>
                ),
              },
              {
                label: 'NIS',
                render: (item: any) => (
                  <Typography>{item.studentId}</Typography>
                ),
              },
              {
                label: 'Status',
                render: (item: any) => (
                  <Chip
                    label={item.isPresent ? 'Hadir' : 'Tidak Hadir'}
                    color={item.isPresent ? 'success' : 'error'}
                    size="small"
                  />
                ),
              },
              {
                label: 'Login Time',
                render: (item: any) => (
                  <Typography>
                    {item.loginTime
                      ? new Date(item.loginTime).toLocaleString()
                      : '-'}
                  </Typography>
                ),
              },
              {
                label: 'Online',
                render: (item: any) => (
                  <Chip
                    label={item.onlineStatus ? 'Online' : 'Offline'}
                    color={item.onlineStatus ? 'success' : 'default'}
                    size="small"
                  />
                ),
              },
            ]}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AttendanceDialog
