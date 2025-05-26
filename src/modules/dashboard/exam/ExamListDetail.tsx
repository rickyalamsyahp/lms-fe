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
import screenfull from 'screenfull'
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

  // Base URL untuk asset (sesuaikan dengan backend URL Anda)
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

  // Helper function to render images
  const renderImage = (imageUrl: string, alt: string) => {
    if (!imageUrl) return null

    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${BASE_URL}${imageUrl}`

    return (
      <Box sx={{ my: 2 }}>
        <img
          src={fullImageUrl}
          alt={alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
          onError={(e) => {
            console.error('Error loading image:', fullImageUrl)
            e.currentTarget.style.display = 'none'
          }}
        />
      </Box>
    )
  }

  // Helper function to render audio
  const renderAudio = (audioUrl: string) => {
    if (!audioUrl) return null

    const fullAudioUrl = audioUrl.startsWith('http')
      ? audioUrl
      : `${BASE_URL}${audioUrl}`

    return (
      <Box sx={{ my: 2 }}>
        <audio
          controls
          style={{ width: '100%', maxWidth: '400px' }}
          onError={(e) => {
            console.error('Error loading audio:', fullAudioUrl)
          }}
        >
          <source src={fullAudioUrl} type="audio/mpeg" />
          <source src={fullAudioUrl} type="audio/wav" />
          <source src={fullAudioUrl} type="audio/ogg" />
          <source src={fullAudioUrl} type="audio/m4a" />
          Your browser does not support the audio element.
        </audio>
      </Box>
    )
  }

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

      const shuffleArray2 = (array: any[]) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      }

      const displayQuestions = questionsResponse.data.map(
        (questionData: any) => ({
          id: questionData.id,
          question: questionData.content,
          imageUrl: questionData.imageUrl,
          audioUrl: questionData.audioUrl,
          equation: questionData.equation,
          explanation: questionData.explanation,
          points: questionData.points,
          options: shuffleArray2(questionData.answers).map(
            (answer: any, index: any) => ({
              value: String.fromCharCode(97 + index),
              label: answer.content,
              isCorrect: answer.isCorrect,
              imageUrl: answer.imageUrl,
              audioUrl: answer.audioUrl,
            })
          ),
        })
      )

      // Fungsi untuk mengacak array pertanyaan
      const shuffleArray = (array: any[]): any[] => {
        const copiedArray = [...array] // Hindari mutasi langsung pada array asli
        for (let i = copiedArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]]
        }
        return copiedArray
      }
      // Set state dengan pertanyaan yang sudah diacak, tapi options tetap urut
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
      handleSubmitExam()
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

  // Helper function to convert answers with isCorrect values
  const convertAnswersToContent = () => {
    const convertedAnswers = {} as any

    Object.keys(answers).forEach((questionId) => {
      const selectedOptionValue = answers[questionId] // This is 'a', 'b', 'c', 'd'
      const question = displayQuestions.find(
        (q: any) => q.id.toString() === questionId
      )

      if (question) {
        const selectedOption = question.options.find(
          (opt: any) => opt.value === selectedOptionValue
        )
        if (selectedOption) {
          // Send the actual content/text of the selected answer
          convertedAnswers[questionId] = selectedOption.label
        }
      }
    })

    return convertedAnswers
  }

  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true)

      // Convert answers to content format (send actual answer text)
      const convertedAnswers = convertAnswersToContent()

      const data = {
        questionBankId: id, // Changed from examId to questionBankId to match backend
        answers: convertedAnswers, // Now sending actual answer content/text
        isAutoSubmit: false,
        duration: examData?.duration ? examData.duration * 60 - timeLeft : 0, // Calculate actual duration taken
        violations: 0,
      }

      await postExamQuestions(data)
      setExamSubmitted(true)
      setIsSubmitting(false)

      if (screenfull.isEnabled && screenfull.isFullscreen) {
        await screenfull.exit()
      }

      setTimeout(() => {
        navigate('/dashboard/exam')
      }, 2000)
    } catch (error) {
      console.error('Error submitting exam', error)
      setIsSubmitting(false)
    }
  }

  // For demonstration purposes, if questions API isn't available yet
  const demoQuestions = [
    {
      id: 1,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      imageUrl: '',
      audioUrl: '',
      equation: '',
      explanation: '',
      points: 10,
      options: [
        {
          value: 'a',
          label: 'Jawaban A benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'b',
          label: 'Jawaban B benar',
          isCorrect: true,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'c',
          label: 'Jawaban C benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'd',
          label: 'Jawaban D benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
      ],
    },
    {
      id: 2,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      imageUrl: '',
      audioUrl: '',
      equation: '',
      explanation: '',
      points: 10,
      options: [
        {
          value: 'a',
          label: 'Jawaban A benar',
          isCorrect: true,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'b',
          label: 'Jawaban B benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'c',
          label: 'Jawaban C benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'd',
          label: 'Jawaban D benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
      ],
    },
    {
      id: 3,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      imageUrl: '',
      audioUrl: '',
      equation: '',
      explanation: '',
      points: 10,
      options: [
        {
          value: 'a',
          label: 'Jawaban A benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'b',
          label: 'Jawaban B benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'c',
          label: 'Jawaban C benar',
          isCorrect: true,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'd',
          label: 'Jawaban D benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
      ],
    },
    {
      id: 4,
      question: 'Jawab pertanyaan dibawah ini dengan benar',
      imageUrl: '',
      audioUrl: '',
      equation: '',
      explanation: '',
      points: 10,
      options: [
        {
          value: 'a',
          label: 'Jawaban A benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'b',
          label: 'Jawaban B benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'c',
          label: 'Jawaban C benar',
          isCorrect: false,
          imageUrl: '',
          audioUrl: '',
        },
        {
          value: 'd',
          label: 'Jawaban D benar',
          isCorrect: true,
          imageUrl: '',
          audioUrl: '',
        },
      ],
    },
  ]

  // Use this until the real questions API is available
  const displayQuestions = questions.length > 0 ? questions : demoQuestions

  useEffect(() => {
    if (!answers || answers.length === 0) return

    const handleBlur = async () => {
      try {
        await handleSubmitExam()
      } catch (err) {
        console.error('Gagal submit ujian saat berpindah aplikasi:', err)
      }
    }

    // // Menambahkan event listener untuk menangani perubahan tab dan aplikasi
    // window.addEventListener('beforeunload', handleBeforeUnload)
    // document.addEventListener('visibilitychange', handleTabLeave)
    window.addEventListener('blur', handleBlur)

    // Cleanup function untuk menghapus event listeners saat komponen di-unmount
    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload)
      // document.removeEventListener('visibilitychange', handleTabLeave)
      window.removeEventListener('blur', handleBlur)
    }
  }, [answers])

  useEffect(() => {
    setIsExamStarted(true)

    if (screenfull.isEnabled) {
      screenfull.request().catch(() => {
        handleSubmitExam()
        // console.warn('Gagal masuk fullscreen')
      })
    }
  }, [])

  useEffect(() => {
    if (!screenfull.isEnabled) return

    const handleFullscreenChange = () => {
      if (!screenfull.isFullscreen) {
        screenfull.request().catch(() => {
          console.warn('Tidak bisa kembali ke fullscreen.')
        })
      }
    }

    screenfull.on('change', handleFullscreenChange)

    return () => {
      screenfull.off('change', handleFullscreenChange)
    }
  }, [answers])

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
              Kelas:{' '}
              {examData?.classrooms?.map((c: any) => c.nama).join(', ') ||
                'X KULINER 2'}
            </Typography>
            <Typography>Semester: {examData?.semester || '2'}</Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3 }}>
          {displayQuestions.map((question: any, index: any) => (
            <Box
              key={question.id}
              sx={{
                mb: 4,
                pb: 3,
                borderBottom:
                  index < displayQuestions.length - 1
                    ? '1px solid #e0e0e0'
                    : 'none',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {index + 1}. {question.question}
              </Typography>

              {/* Render question image if exists */}
              {renderImage(question.imageUrl, `Question ${index + 1} image`)}

              {/* Render question audio if exists */}
              {renderAudio(question.audioUrl)}

              {/* Render equation if exists */}
              {question.equation && (
                <Box sx={{ my: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Persamaan:
                  </Typography>
                  <Typography
                    sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}
                  >
                    {question.equation}
                  </Typography>
                </Box>
              )}

              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                sx={{ mt: 2 }}
              >
                {question.options.map((option: any) => (
                  <Box key={option.value} sx={{ mb: 1 }}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box sx={{ width: '100%' }}>
                          <Typography>
                            {option.value.toUpperCase()}. {option.label}
                          </Typography>
                          {/* Render option image if exists */}
                          {renderImage(
                            option.imageUrl,
                            `Option ${option.value} image`
                          )}
                          {/* Render option audio if exists */}
                          {renderAudio(option.audioUrl)}
                        </Box>
                      }
                      sx={{
                        m: 0,
                        p: 1,
                        width: '100%',
                        alignItems: 'flex-start',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'grey.50',
                        },
                        '& .MuiFormControlLabel-label': {
                          width: '100%',
                        },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              {/* Show points */}
              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="body2" color="text.secondary">
                  Poin: {question.points}
                </Typography>
              </Box>
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
