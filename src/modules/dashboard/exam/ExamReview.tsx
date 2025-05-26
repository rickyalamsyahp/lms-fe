/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { ArrowBack, CheckCircle, Cancel, HelpOutline } from '@mui/icons-material'
import {
  Box, Container, Paper, Stack, Typography, IconButton, Chip,
  FormControlLabel, Radio, RadioGroup, Checkbox, FormGroup, Card,
  CardContent, Divider, Alert, Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

export default function EnhancedExamReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [examData, setExamData] = useState<any>(null)
  const [questions, setQuestions] = useState<any>([])
  const [studentAnswers, setStudentAnswers] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchExamReview()
    }
  }, [id])

  const fetchExamReview = async () => {
    try {
      setIsLoading(true)
      
      // Fetch exam data and student's answers
      const [examResponse, reviewResponse] = await Promise.all([
        fetch(`/api/question-bank/${id}`),
        fetch(`/api/exam-results/${id}/review`)
      ])
      
      const examData = await examResponse.json()
      const reviewData = await reviewResponse.json()
      
      setExamData(examData.data)
      setQuestions(reviewData.data.questions)
      setStudentAnswers(reviewData.data.answers)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching exam review:', error)
      setIsLoading(false)
    }
  }

  const getAnswerStatus = (question: any, studentAnswer: any) => {
    if (!studentAnswer) return 'unanswered'
    
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return studentAnswer === question.correctAnswer ? 'correct' : 'incorrect'
      
      case 'complex_multiple_choice':
        const correctAnswers = question.correctAnswers || []
        const studentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]
        const isCorrect = correctAnswers.length === studentAnswers.length && 
                         correctAnswers.every((ans: string) => studentAnswers.includes(ans))
        return isCorrect ? 'correct' : 'incorrect'
      
      case 'essay':
        const keywords = question.keywords || []
        const answerText = studentAnswer.toLowerCase()
        const matchedKeywords = keywords.filter((keyword: string) => 
          answerText.includes(keyword.toLowerCase())
        )
        const matchPercentage = matchedKeywords.length / keywords.length
        
        if (matchPercentage >= 0.8) return 'correct'
        if (matchPercentage >= 0.6) return 'partial'
        return 'incorrect'
      
      default:
        return 'unknown'
    }
  }

  const renderAnswerStatus = (status: string, points: number, earnedPoints: number) => {
    const statusConfig = {
      correct: { icon: <CheckCircle />, color: 'success', label: 'Benar' },
      incorrect: { icon: <Cancel />, color: 'error', label: 'Salah' },
      partial: { icon: <HelpOutline />, color: 'warning', label: 'Sebagian Benar' },
      unanswered: { icon: <HelpOutline />, color: 'default', label: 'Tidak Dijawab' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unanswered
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color as any}
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          {earnedPoints}/{points} poin
        </Typography>
      </Box>
    )
  }

  const renderStudentAnswer = (question: any, studentAnswer: any) => {
    if (!studentAnswer) {
      return <Typography color="text.secondary" fontStyle="italic">Tidak dijawab</Typography>
    }

    switch (question.type) {
      case 'essay':
        return (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2">{studentAnswer}</Typography>
          </Paper>
        )
      
      case 'complex_multiple_choice':
        const selectedAnswers = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]
        return (
          <Box>
            {question.options.map((option: any) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={selectedAnswers.includes(option.value)}
                    disabled
                  />
                }
                label={`${option.value}. ${option.label}`}
              />
            ))}
          </Box>
        )
      
      default:
        return (
          <RadioGroup value={studentAnswer}>
            {question.options.map((option: any) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio disabled />}
                label={`${option.value}. ${option.label}`}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: option.value === studentAnswer ? 'primary.main' : 'text.primary'
                  }
                }}
              />
            ))}
          </RadioGroup>
        )
    }
  }

  const renderCorrectAnswer = (question: any) => {
    switch (question.type) {
      case 'essay':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Kata Kunci:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {question.keywords?.map((keyword: string, index: number) => (
                <Chip key={index} label={keyword} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )
      
      case 'complex_multiple_choice':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Jawaban yang Benar:</Typography>
            {question.options.map((option: any) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={question.correctAnswers?.includes(option.value)}
                    disabled
                  />
                }
                label={`${option.value}. ${option.label}`}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: question.correctAnswers?.includes(option.value) ? 'success.main' : 'text.primary'
                  }
                }}
              />
            ))}
          </Box>
        )
      
      default:
        return (
          <RadioGroup value={question.correctAnswer}>
            {question.options.map((option: any) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio disabled />}
                label={`${option.value}. ${option.label}`}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: option.value === question.correctAnswer ? 'success.main' : 'text.primary'
                  }
                }}
              />
            ))}
          </RadioGroup>
        )
    }
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Memuat review ujian...</Typography>
      </Container>
    )
  }

  return (
    <MathJaxContext>
      <Container maxWidth="md" sx={{ py: 2 }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">Review Ujian</Typography>
              <Typography variant="h6" color="primary">{examData?.title}</Typography>
              <Typography color="text.secondary">
                {examData?.subject?.nama} • {examData?.classroom?.nama}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Ringkasan Hasil</Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Nilai</Typography>
                <Typography variant="h4" color="primary">{studentAnswers.totalScore}/{studentAnswers.totalPoints}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Persentase</Typography>
                <Typography variant="h4" color="primary">{Math.round(studentAnswers.percentage)}%</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Benar</Typography>
                <Typography variant="h4" color="success.main">{studentAnswers.correctCount}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Salah</Typography>
                <Typography variant="h4" color="error.main">{studentAnswers.incorrectCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Questions Review */}
        <Stack spacing={3}>
          {questions.map((question: any, index: number) => {
            const studentAnswer = studentAnswers.answers[question.id]
            const status = getAnswerStatus(question, studentAnswer)
            const earnedPoints = studentAnswers.questionScores?.[question.id] || 0
            
            return (
              <Card key={question.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {index + 1}. {question.content}
                    </Typography>
                    {renderAnswerStatus(status, question.points, earnedPoints)}
                  </Box>

                  {/* Question Media */}
                  {question.imageUrl && (
                    <Box sx={{ mb: 2 }}>
                      <img 
                        src={question.imageUrl} 
                        alt="Question" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} 
                      />
                    </Box>
                  )}

                  {question.audioUrl && (
                    <Box sx={{ mb: 2 }}>
                      <audio controls style={{ width: '100%' }}>
                        <source src={question.audioUrl} />
                      </audio>
                    </Box>
                  )}

                  {question.equation && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <MathJax>{`$${question.equation}$`}</MathJax>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Student Answer */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" gutterBottom color="primary">
                        Jawaban Anda:
                      </Typography>
                      {renderStudentAnswer(question, studentAnswer)}
                    </Box>

                    {/* Correct Answer */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" gutterBottom color="success.main">
                        Jawaban yang Benar:
                      </Typography>
                      {renderCorrectAnswer(question)}
                    </Box>
                  </Box>

                  {/* Explanation */}
                  {question.explanation && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Alert severity="info">
                        <Typography variant="subtitle2" gutterBottom>Penjelasan:</Typography>
                        <Typography variant="body2">{question.explanation}</Typography>
                      </Alert>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </Stack>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/dashboard/exam')}>
            Kembali ke Daftar Ujian
          </Button>
        </Box>
      </Container>
    </MathJaxContext>
  )
}