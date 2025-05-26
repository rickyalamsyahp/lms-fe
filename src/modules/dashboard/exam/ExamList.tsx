/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Info, Replay } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { useSession } from '../../../context/session'
import ExamCard from './__components/ExamCard'
import { useCourseList } from './__shared/api'

export default function EnhancedExamList() {
  const navigate = useNavigate()
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [showExamInfo, setShowExamInfo] = useState(false)

  const { data: examList, mutate: refetch } = useCourseList({
    page,
    size,
    kodeKelas: state.profile?.kodeKelas,
    studentId: state.profile?.nis,
  })

  const checkExamAvailability = (exam: any) => {
    const now = new Date()
    const examDate = new Date(exam.scheduledAt)
    const [hours, minutes] = exam.jamUjian.split(':').map(Number)
    examDate.setHours(hours, minutes, 0, 0)

    const timeDiff = examDate.getTime() - now.getTime()
    const minutesDiff = Math.floor(timeDiff / (1000 * 60))

    return {
      canStart: timeDiff <= 0 && timeDiff > -(exam.duration * 60 * 1000),
      timeUntilStart: minutesDiff > 0 ? minutesDiff : 0,
      isExpired: timeDiff < -(exam.duration * 60 * 1000),
    }
  }

  const getExamStatus = (exam: any) => {
    if (
      exam.result?.status === 'submitted' ||
      exam.result?.status === 'auto_submitted'
    ) {
      return { label: 'Selesai', color: 'success' as const }
    }
    if (exam.result?.status === 'in_progress') {
      return { label: 'Sedang Berlangsung', color: 'warning' as const }
    }
    if (exam.result?.status === 'reopened') {
      return { label: 'Dibuka Kembali', color: 'info' as const }
    }

    const availability = checkExamAvailability(exam)
    if (availability.isExpired) {
      return { label: 'Berakhir', color: 'error' as const }
    }
    if (availability.canStart) {
      return { label: 'Dapat Dimulai', color: 'success' as const }
    }
    if (availability.timeUntilStart > 0) {
      return {
        label: `${availability.timeUntilStart} menit lagi`,
        color: 'default' as const,
      }
    }

    return { label: 'Menunggu', color: 'default' as const }
  }

  const handleStartExam = async (exam: any) => {
    const availability = checkExamAvailability(exam)
    // console.log(availability)

    if (!availability.canStart && exam.result?.status !== 'reopened') {
      setSelectedExam(exam)
      setShowExamInfo(true)
      return
    }

    try {
      // Try to enter fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }

      navigate(`/dashboard/exam/${exam.id}`)
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
      navigate(`/dashboard/exam/${exam.id}`)
    }
  }

  const columns = [
    {
      label: 'Ujian',
      render: (item: any) => (
        <Box>
          <Typography fontWeight="bold">{item.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.subject?.nama}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.description}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Jadwal',
      render: (item: any) => (
        <Box>
          <Typography variant="body2">
            {new Date(item.scheduledAt).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          <Typography variant="body2" color="primary">
            {item.jamUjian} WIB
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Durasi: {item.duration} menit
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Info',
      render: (item: any) => (
        <Box>
          <Typography variant="body2">
            {item.totalQuestions} soal • {item.totalPoints} poin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.teacher?.nama}
          </Typography>
          {item.passingScore && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              KKM: {item.passingScore}%
            </Typography>
          )}
        </Box>
      ),
    },
    {
      label: 'Status',
      render: (item: any) => {
        const status = getExamStatus(item)
        return (
          <Box>
            <Chip label={status.label} color={status.color} size="small" />
            {item.result?.score !== undefined && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Nilai: {item.result.score}/{item.result.totalPoints}
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      label: 'Aksi',
      render: (item: any) => {
        const status = getExamStatus(item)
        const availability = checkExamAvailability(item)

        return (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<Info />}
              onClick={() => {
                setSelectedExam(item)
                setShowExamInfo(true)
              }}
            >
              Info
            </Button>

            {(status.label === 'Dapat Dimulai' ||
              item.result?.status === 'reopened') &&
              item.result?.results.length !== 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleStartExam(item)}
                >
                  {item.result?.status === 'reopened'
                    ? 'Lanjut Ujian'
                    : 'Mulai Ujian'}
                </Button>
              )}
          </Stack>
        )
      },
    },
  ]

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Menu Ujian"
          searchProps={{
            onSearch: (newSearch) => setSearch(newSearch),
            placeholder: 'Cari ujian...',
          }}
          rightAddon={
            <IconButton onClick={() => refetch()} sx={{ mr: isMobile ? 0 : 2 }}>
              <Replay />
            </IconButton>
          }
        />

        <Box sx={{ flex: 1, px: 2 }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              DAFTAR UJIAN
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Berikut adalah daftar ujian yang tersedia untuk Anda.
            </Typography>
          </Box>

          {isMobile ? (
            <Stack spacing={2}>
              {examList?.results?.map((exam: any) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onStartExam={handleStartExam}
                />
              ))}
            </Stack>
          ) : (
            <DataTable
              data={examList?.results}
              loading={!examList}
              columns={columns}
              paginationProps={{
                rowsPerPageOptions: [10, 25, 50],
                rowsPerPage: size,
                count: Number(examList?.total || 0),
                page,
                onPageChange: (e, value) => setPage(value + 1),
                onRowsPerPageChange: (e) => {
                  setSize(Number(e.target.value))
                  setPage(1)
                },
              }}
            />
          )}
        </Box>
      </Stack>

      {/* Exam Info Dialog */}
      <Dialog
        open={showExamInfo}
        onClose={() => setShowExamInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedExam?.title}</DialogTitle>
        <DialogContent>
          {selectedExam && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Mata Pelajaran:</Typography>
                <Typography>{selectedExam.subject?.nama}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Jadwal:</Typography>
                <Typography>
                  {new Date(selectedExam.scheduledAt).toLocaleDateString(
                    'id-ID',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}{' '}
                  • {selectedExam.jamUjian} WIB
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Durasi:</Typography>
                <Typography>{selectedExam.duration} menit</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Jumlah Soal:</Typography>
                <Typography>
                  {selectedExam.totalQuestions} soal ({selectedExam.totalPoints}{' '}
                  poin)
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Guru:</Typography>
                <Typography>{selectedExam.teacher?.nama}</Typography>
              </Box>

              {selectedExam.instructions && (
                <Box>
                  <Typography variant="subtitle2">Instruksi:</Typography>
                  <Typography variant="body2">
                    {selectedExam.instructions}
                  </Typography>
                </Box>
              )}

              {selectedExam.passingScore && (
                <Alert severity="info">
                  Nilai minimum kelulusan: {selectedExam.passingScore}%
                </Alert>
              )}

              {selectedExam.requireAllAnswers && (
                <Alert severity="warning">
                  Anda harus menjawab semua soal sebelum dapat submit.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExamInfo(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
