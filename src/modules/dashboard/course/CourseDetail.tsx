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

export default function CourseDetail() {
  const { id } = useParams()
  const [examData, setExamData] = useState<any>(null)
  const [questions, setQuestions] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchExamData = async () => {
    try {
      setIsLoading(true)
      const examData = await getCoursById(id)
      console.log(examData)

      const examResponse = examData.data
      setExamData(examResponse)

      const questionsResponse = await getExamQuestions(id)

      const displayQuestions = questionsResponse.data.map(
        (questionData: any) => ({
          id: questionData.id,
          question: questionData.content,
          options: questionData.answers.map((answer: any, index: any) => ({
            value: String.fromCharCode(97 + index),
            label: answer.content,
            isCorrect: answer.isCorrect,
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
            {examData?.classrooms.map((c: any) => c.nama).join(', ') ||
              'X KULINER 2'}
          </Typography>
          <Typography>Semester: {examData?.semester || '2'}</Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          {questions.map((question: any, index: number) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1 }}>
                {index + 1}. {question.question}
              </Typography>
              <RadioGroup
                value={
                  question.options.find((option: any) => option.isCorrect === 1)
                    ?.value ?? ''
                }
              >
                {question.options.map((option: any) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={`${option.value}. ${option.label}`}
                    sx={{
                      bgcolor:
                        option.isCorrect === 1 ? 'success.light' : 'inherit',
                      borderRadius: 1,
                      px: 1,
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}
        </Paper>
      </Stack>
    </Container>
  )
}
