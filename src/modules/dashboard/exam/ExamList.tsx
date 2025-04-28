/* eslint-disable @typescript-eslint/no-unused-vars */
// BankSoalList.jsx
'use client'

import { Replay } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { useSession } from '../../../context/session'
import { useCourseList } from './__shared/api'

export default function ExamList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [showFormCreate, setShowFormCreate] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(undefined)
  const [openTimeWarning, setOpenTimeWarning] = useState(false)

  const { data: courseList, mutate: refetch } = useCourseList({
    page: 1,
    size: 50,
    kodeKelas: state.profile?.kodeKelas,
    studentId: state.profile?.nis,
    // order: 'asc',
    // orderBy: 'level',
    // 'published:eq': true,
  })

  // Fetch data when filters change
  useEffect(() => {
    // In a real app, you would fetch data based on filters
    console.log('Fetching data...')
  }, [page, size, search])

  // Function to check if the current time matches the scheduled exam time
  const checkExamTime = (exam: any) => {
    // Get current date and time
    const currentTime = new Date()

    // Check if the exam has scheduledAt and jamUjian properties
    if (exam?.scheduledAt) {
      const scheduledTime = new Date(exam.scheduledAt)

      // If jamUjian exists and needs to be compared as well
      if (exam?.jamUjian) {
        // Extract hours and minutes from jamUjian (assuming format like "08:00")
        const [hours, minutes] = exam.jamUjian.split(':').map(Number)

        // Check if current time matches scheduled date and time
        const sameDate =
          currentTime.getDate() === scheduledTime.getDate() &&
          currentTime.getMonth() === scheduledTime.getMonth() &&
          currentTime.getFullYear() === scheduledTime.getFullYear()

        // Check if the current time matches the hour and minute
        const sameTime =
          currentTime.getHours() === hours &&
          currentTime.getMinutes() === minutes

        return sameDate && sameTime
      }

      // If only scheduledAt needs to be compared
      return currentTime.getTime() === scheduledTime.getTime()
    }

    // If no scheduled time is set, allow the exam to start
    return true
  }

  // Handle exam start
  const handleStartExam = async (exam: any) => {
    try {
      if (checkExamTime(exam)) {
        // 1. Masuk ke fullscreen
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
        navigate(`/dashboard/exam/${exam?.id}`)
        // 2. Listen event kalau user keluar tab
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            alert('Anda keluar dari halaman ujian! Ujian otomatis dibatalkan.')
            // Bisa navigate keluar atau logout
            // navigate('/dashboard'); // contoh
          }
        })

        // 3. Navigate ke halaman ujian

        navigate(`/dashboard/exam/${exam?.id}`)
      } else {
        setSelectedItem(exam)
        setOpenTimeWarning(true)
      }
      // navigate(`/dashboard/exam/${exam?.id}`);
    } catch (error) {
      console.error('Gagal masuk fullscreen:', error)
    }
    // navigate(`/dashboard/exam/${exam?.id}`)
  }

  const columns = [
    {
      label: 'Mata Pelajaran',
      render: (item: any) => <Typography>{item.subject?.nama}</Typography>,
    },
    {
      label: 'Kelas',
      render: (item: any) => <Typography>{item.classroom?.nama}</Typography>,
    },
    {
      label: 'Jurusan',
      render: (item: any) => (
        <Typography>{item.classroom?.jurusans?.nama}</Typography>
      ),
    },
    {
      label: 'Tanggal Ujian',
      render: (item: any) => (
        <Typography>
          {item.scheduledAt
            ? new Date(item.scheduledAt).toLocaleDateString()
            : '-'}
        </Typography>
      ),
    },
    {
      label: 'Jam Ujian',
      render: (item: any) => <Typography>{item.jamUjian || '-'}</Typography>,
    },
    {
      label: 'Durasi',
      render: (item: any) => (
        <Typography>{item.duration || '-'} Menit</Typography>
      ),
    },
    {
      label: 'Nama Guru',
      render: (item: any) => <Typography>{item.teacher?.nama}</Typography>,
    },
    {
      label: 'Aksi',
      render: (item: any) => (
        <Stack direction="row" spacing={1}>
          {item.result !== null ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              // onClick={() => handleStartExam(item)}
              disabled={true}
            >
              Sudah Ujian
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleStartExam(item)}
              // disabled={item.result !== null ? true : false}
            >
              Mulai Ujian
            </Button>
          )}
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Menu Ujian"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Pencarian...',
          }}
          rightAddon={
            <>
              <IconButton
                onClick={() => refetch()}
                sx={{ mr: isMobile ? 0 : 2 }}
              >
                <Replay />
              </IconButton>
            </>
          }
        />

        <Box sx={{ flex: 1, px: 2 }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              MENU UJIAN
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Menu ujian berisi informasi terkait dengan daftar ujian yang akan
              dilakukan oleh siswa.
            </Typography>
          </Box>

          <DataTable
            data={courseList?.results}
            loading={!courseList}
            columns={columns}
            paginationProps={{
              rowsPerPageOptions: [10, 25, 50],
              rowsPerPage: size,
              count: Number(courseList?.total || 0),
              page,
              onPageChange: (e, value) => setPage(value + 1),
              onRowsPerPageChange: (e) => {
                setSize(Number(e.target.value))
                setPage(1)
              },
            }}
          />
        </Box>
      </Stack>

      {/* Warning Dialog when exam time doesn't match */}
      <Dialog
        open={openTimeWarning}
        onClose={() => setOpenTimeWarning(false)}
        aria-labelledby="time-warning-dialog-title"
      >
        <DialogTitle id="time-warning-dialog-title">
          Belum Waktunya Ujian
        </DialogTitle>
        <DialogContent>
          <Typography>
            Maaf, belum waktunya untuk mengerjakan ujian ini. Ujian hanya dapat
            dimulai sesuai jadwal yang telah ditentukan.
          </Typography>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Detail Ujian:</Typography>
              <Typography variant="body2">
                Mata Pelajaran: {selectedItem.subject?.nama}
              </Typography>
              <Typography variant="body2">
                Tanggal:{' '}
                {selectedItem.scheduledAt
                  ? new Date(selectedItem.scheduledAt).toLocaleDateString()
                  : '-'}
              </Typography>
              <Typography variant="body2">
                Jam: {selectedItem.jamUjian || '-'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimeWarning(false)} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
