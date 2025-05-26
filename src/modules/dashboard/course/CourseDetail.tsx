/* eslint-disable @typescript-eslint/no-unused-vars */
// ExamReview.jsx
'use client'

import {
  Box,
  Container,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCoursById } from '../exam/__shared/api'
import { getExamQuestions } from './__shared/api'

export default function ExamReview() {
  const { id } = useParams()
  const [examData, setExamData] = useState<any>(null)
  const [questions, setQuestions] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

  // Base URL untuk asset (sesuaikan dengan backend URL Anda)
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

  const fetchExamData = async () => {
    try {
      setIsLoading(true)
      const examData = await getCoursById(id)

      const examResponse = examData.data
      setExamData(examResponse)

      const questionsResponse = await getExamQuestions(id)

      const displayQuestions = questionsResponse.data.questions.map(
        (questionData: any) => ({
          id: questionData.id,
          question: questionData.content,
          imageUrl: questionData.imageUrl,
          audioUrl: questionData.audioUrl,
          equation: questionData.equation,
          explanation: questionData.explanation,
          points: questionData.points,
          options: questionData.answers.map((answer: any, index: any) => ({
            value: String.fromCharCode(97 + index),
            label: answer.content,
            isCorrect: answer.isCorrect,
            imageUrl: answer.imageUrl,
            audioUrl: answer.audioUrl,
          })),
        })
      )

      setQuestions(displayQuestions)
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
          onError={(e: any) => {
            console.error('Error loading audio:', fullAudioUrl)
          }}
        >
          <source src={fullAudioUrl} type="audio/mpeg" />
          <source src={fullAudioUrl} type="audio/wav" />
          <source src={fullAudioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </Box>
    )
  }

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
        <Typography>Memuat data ujian...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5">Review Ujian</Typography>
          <Typography>
            Mata Pelajaran: {examData?.subject?.nama || 'Matematika'}
          </Typography>
          <Typography>
            Kelas:{' '}
            {examData?.classrooms?.map((c: any) => c.nama).join(', ') ||
              'X KULINER 2'}
          </Typography>
          <Typography>Semester: {examData?.semester || '2'}</Typography>
          <Typography>Judul: {examData?.title || 'N/A'}</Typography>
          <Typography>Durasi: {examData?.duration || 0} menit</Typography>
          {examData?.instructions && (
            <Typography>Instruksi: {examData.instructions}</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          {questions.map((question: any, index: number) => (
            <Box
              key={question.id}
              sx={{
                mb: 4,
                pb: 3,
                borderBottom:
                  index < questions.length - 1 ? '1px solid #e0e0e0' : 'none',
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
                value={
                  question.options.find((option: any) => option.isCorrect === 1)
                    ?.value ?? ''
                }
                sx={{ mt: 2 }}
              >
                {question.options.map((option: any) => (
                  <Box key={option.value} sx={{ mb: 1 }}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography>
                            {option.value}. {option.label}
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
                        bgcolor:
                          option.isCorrect === 1 ? 'success.light' : 'inherit',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        m: 0,
                        width: '100%',
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          width: '100%',
                        },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              {/* Show points and explanation */}
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Poin: {question.points}
                </Typography>
                {question.explanation && (
                  <Box
                    sx={{ mt: 1, p: 2, bgcolor: 'info.light', borderRadius: 1 }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      Penjelasan:
                    </Typography>
                    <Typography variant="body2">
                      {question.explanation}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      </Stack>
    </Container>
  )
}
