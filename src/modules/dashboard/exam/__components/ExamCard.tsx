import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

function ExamCard({ exam, onStartExam }: any) {
  const navigate = useNavigate()
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
  const status = getExamStatus(exam)

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {exam.title}
          </Typography>
          <Chip label={status.label} color={status.color} size="small" />
        </Box>

        <Typography color="text.secondary" gutterBottom>
          {exam.subject?.nama}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {new Date(exam.scheduledAt).toLocaleDateString('id-ID')} •{' '}
          {exam.jamUjian} WIB
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {exam.totalQuestions} soal • {exam.duration} menit •{' '}
          {exam.teacher?.nama}
        </Typography>
      </CardContent>

      <CardActions>
        {(status.label === 'Dapat Dimulai' ||
          exam.result?.status === 'reopened') && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onStartExam(exam)}
            fullWidth
          >
            {exam.result?.status === 'reopened'
              ? 'Lanjut Ujian'
              : 'Mulai Ujian'}
          </Button>
        )}

        {status.label === 'Selesai' && exam.allowReview && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/dashboard/exam/${exam.id}/review`)}
            fullWidth
          >
            Review Jawaban
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default ExamCard
