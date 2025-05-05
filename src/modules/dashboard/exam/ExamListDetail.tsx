/* eslint-disable @typescript-eslint/no-unused-vars */
// ExamTake.jsx
'use client'

import { Timer } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '../../../context/session'
import {
  getCoursById,
  getExamQuestions,
  postExamQuestions,
} from './__shared/api'

export default function ExamTake() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useSession()

  const [examData, setExamData] = useState<any>(null)
  const [questions, setQuestions] = useState<any>([])
  const [isLoading, setIsLoading] = useState<any>(true)
  const [answers, setAnswers] = useState<any>({})
  const [timeLeft, setTimeLeft] = useState<any>(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<any>(false)
  const [examSubmitted, setExamSubmitted] = useState<any>(false)
  const [isSubmitting, setIsSubmitting] = useState<any>(false)
  const [isExamStarted, setIsExamStarted] = useState(false)
  // Fetch exam data
  const fetchExamData = async () => {
    try {
      setIsLoading(true)
      const examData = await getCoursById(id)
      const examResponse = examData.data as any
      setExamData(examResponse)

      // Set timer based on duration from API response
      if (examResponse && examResponse.duration) {
        setTimeLeft(examResponse.duration * 60) // Convert minutes to seconds
      }

      // In a real implementation, you would fetch questions as well
      const questionsResponse = await getExamQuestions(id)
      const displayQuestions = questionsResponse.data.map(
        (questionData: any) => {
          return {
            id: questionData.id,
            question: questionData.content, // or another field if you want a different label for the question
            options: questionData.answers.map((answer: any) => ({
              value: answer.option, // Answer option (a, b, c, etc.)
              label: answer.content, // The content for that option
            })),
          }
        }
      )
      const shuffleArray = (array: any[]): any[] => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
        }
        return array
      }
      setQuestions(shuffleArray(displayQuestions))

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching exam data:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchExamData()
    }
  }, [id])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || examSubmitted) return

    const timerId = setInterval(() => {
      setTimeLeft((prev: any) => prev - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft, examSubmitted])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !examSubmitted) {
      // handleSubmitExam()
    }
  }, [timeLeft])

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: any, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmitExam = async () => {
    // setShowConfirmSubmit(false)
    try {
      // setIsSubmitting(true)

      const data = {
        examId: id,
        studentId: state.profile?.nis,
        answers,
      }
      // console.log(data)
      await postExamQuestions(data)
      setExamSubmitted(true)
      setIsSubmitting(false)

      // Show success message or redirect
      setTimeout(() => {
        navigate('/dashboard/exam')
      }, 2000)
    } catch (error) {
      console.error('Error submitting exam', error)
      // setIsSubmitting(false)
    }
  }

  // For demonstration purposes, if questions API isn't available yet
  const demoQuestions = [
    {
      id: 1,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      options: [
        { value: 'A', label: 'Jawaban A benar' },
        { value: 'B', label: 'Jawaban B benar' },
        { value: 'C', label: 'Jawaban C benar' },
        { value: 'D', label: 'Jawaban D benar' },
      ],
    },
    {
      id: 2,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      options: [
        { value: 'A', label: 'Jawaban A benar' },
        { value: 'B', label: 'Jawaban B benar' },
        { value: 'C', label: 'Jawaban C benar' },
        { value: 'D', label: 'Jawaban D benar' },
      ],
    },
    {
      id: 3,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      options: [
        { value: 'A', label: 'Jawaban A benar' },
        { value: 'B', label: 'Jawaban B benar' },
        { value: 'C', label: 'Jawaban C benar' },
        { value: 'D', label: 'Jawaban D benar' },
      ],
    },
    {
      id: 4,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      options: [
        { value: 'A', label: 'Jawaban A benar' },
        { value: 'B', label: 'Jawaban B benar' },
        { value: 'C', label: 'Jawaban C benar' },
        { value: 'D', label: 'Jawaban D benar' },
      ],
    },
  ]

  // Use this until the real questions API is available
  const displayQuestions = questions.length > 0 ? questions : demoQuestions
  useEffect(() => {
    if (!answers || answers.length === 0) return

    const handleTabLeave = async () => {
      if (document.hidden) {
        try {
          await handleSubmitExam()
          navigate('/dashboard/exam')
        } catch (err) {
          console.error('Gagal submit ujian saat pindah tab:', err)
        }
      }
    }

    document.addEventListener('visibilitychange', handleTabLeave)
    return () => {
      document.removeEventListener('visibilitychange', handleTabLeave)
    }
  }, [answers])
  useEffect(() => {
    setIsExamStarted(true)
  }, [])
  if (isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Memuat ujian...</Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Selamat mengerjakan ujian</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer color="primary" sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                color={timeLeft < 300 ? 'error' : 'primary'}
              >
                {formatTimeLeft()}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Typography>
              Mata Pelajaran: {examData?.subject?.nama || 'Matematika'}
            </Typography>
            <Typography>
              Waktu Ujian: {examData?.duration || 30} Menit
            </Typography>
            <Typography>
              Kelas: {examData?.classroom?.nama || 'X KULINER 2'}
            </Typography>
            <Typography>Semester: {examData?.semester || '2'}</Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          {displayQuestions.map((question: any, index: any) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1 }}>
                {index + 1}. {question.question}
              </Typography>
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              >
                {question.options.map((option: any) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={`${option.value}. ${option.label}`}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setShowConfirmSubmit(true)}
              disabled={examSubmitted || isSubmitting}
            >
              Selesai
            </Button>
          </Box>
        </Paper>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
      >
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban yang telah
            diberikan tidak dapat diubah setelah ujian diselesaikan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmSubmit(false)}>Batal</Button>
          <Button
            onClick={handleSubmitExam}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Memproses...
              </>
            ) : (
              'Ya, Selesaikan Ujian'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submission Success Dialog */}
      <Dialog open={examSubmitted} aria-labelledby="submission-success-dialog">
        <DialogTitle id="submission-success-dialog">Ujian Selesai</DialogTitle>
        <DialogContent>
          <Typography>
            Terima kasih telah mengerjakan ujian. Hasil ujian Anda akan segera
            diproses.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
