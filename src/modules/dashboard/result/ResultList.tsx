import { Download, Replay, Visibility } from '@mui/icons-material'
import {
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
import Commandbar from '../../../components/shared/Commandbar'
import DataTable from '../../../components/shared/DataTable'
import { useSession } from '../../../context/session'
import ExamResultCard from './__components/ExamResultCard'
import ExamResultDetail from './__components/ExamResultDetail'
import { useCourseExamList } from './__shared/api'

export default function EnhancedCourseListExam() {
  const { isMobile, state } = useSession()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const { data: examList, mutate: refetch } = useCourseExamList(
    state.profile?.scope,
    { page, size }
  )

  const handleDownloadResults = async () => {
    try {
      const response = await fetch('/api/exam-results/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            teacherId: state.isInstructor ? state.profile?.kode : undefined,
            studentId: state.profile?.nis,
            semester: new Date().getMonth() < 6 ? '2' : '1',
          },
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hasil-ujian-${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download results:', error)
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'success'
    if (percentage >= 70) return 'warning'
    return 'error'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = [
    {
      label: 'Siswa',
      render: (item: any) => (
        <Box>
          <Typography fontWeight="bold">{item.student?.nama}</Typography>
          <Typography variant="caption" color="text.secondary">
            NIS: {item.studentId}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Ujian',
      render: (item: any) => (
        <Box>
          <Typography>{item.questionBank?.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.questionBank?.subject?.nama}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.questionBank?.classroom?.nama} • Semester{' '}
            {item.questionBank?.semester}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Tanggal Ujian',
      render: (item: any) => (
        <Typography sx={{ minWidth: 160 }}>
          {formatDate(item.questionBank?.scheduledAt)}
        </Typography>
      ),
    },
    {
      label: 'Hasil',
      render: (item: any) => (
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight="bold">
              {item.score}/{item.totalPoints}
            </Typography>
            <Chip
              label={`${Math.round(item.percentage)}%`}
              color={getScoreColor(item.percentage)}
              size="small"
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Status:{' '}
            {item.status === 'submitted'
              ? 'Submit Manual'
              : item.status === 'auto_submitted'
                ? 'Auto Submit'
                : item.status}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Durasi',
      render: (item: any) => (
        <Typography>
          {item.duration
            ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`
            : '-'}
        </Typography>
      ),
    },
    {
      label: 'Submit',
      render: (item: any) => (
        <Typography variant="body2">
          {item.submittedAt ? formatDate(item.submittedAt) : '-'}
        </Typography>
      ),
    },
    {
      label: 'Aksi',
      render: (item: any) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<Visibility />}
            onClick={() => {
              setSelectedResult(item)
              setShowDetailDialog(true)
            }}
          >
            Detail
          </Button>
          {/* {state.isInstructor && (
            <Button
              size="small"
              startIcon={<Assessment />}
              onClick={() =>
                window.open(
                  `/dashboard/result/${item.questionBankId}`,
                  '_blank'
                )
              }
            >
              Analisis
            </Button>
          )} */}
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Commandbar
          title="Hasil Ujian"
          breadcrumbsProps={{
            items: [{ label: 'Menu Utama' }],
          }}
          rightAddon={
            <>
              <IconButton
                onClick={() => refetch()}
                sx={{ mr: isMobile ? 0 : 2 }}
              >
                <Replay />
              </IconButton>

              {(state.isInstructor || state.isAdmin) && (
                <Button
                  startIcon={<Download />}
                  variant="contained"
                  onClick={handleDownloadResults}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>
              )}
            </>
          }
        />

        <Box sx={{ flex: 1, px: 2 }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              HASIL UJIAN
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Berikut adalah hasil ujian yang telah dikerjakan.
            </Typography>
          </Box>

          {isMobile ? (
            <Stack spacing={2}>
              {examList?.results?.map((result: any) => (
                <ExamResultCard key={result.id} result={result} />
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

      {/* Detail Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detail Hasil Ujian</DialogTitle>
        <DialogContent>
          {selectedResult && <ExamResultDetail result={selectedResult} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailDialog(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
