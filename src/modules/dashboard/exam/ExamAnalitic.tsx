'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function ExamAnalytics() {
  const { id } = useParams()
  const [analytics, setAnalytics] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetchAnalytics()
    }
  }, [id])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/question-bank/${id}/analytics`)
      const data = await response.json()
      setAnalytics(data.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const scoreDistribution = analytics?.scoreDistribution || []
  const questionDifficulty = analytics?.questionDifficulty || []
  const timeAnalysis = analytics?.timeAnalysis || []

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analisis Ujian: {analytics?.examTitle}
      </Typography>

      {analytics && (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Peserta
                </Typography>
                <Typography variant="h4">
                  {analytics.totalParticipants}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Rata-rata Nilai
                </Typography>
                <Typography variant="h4">
                  {Math.round(analytics.averageScore)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Tingkat Kelulusan
                </Typography>
                <Typography variant="h4">
                  {Math.round(analytics.passRate)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Waktu Rata-rata
                </Typography>
                <Typography variant="h4">
                  {Math.round(analytics.averageTime)} min
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Score Distribution Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribusi Nilai
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Pass/Fail Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status Kelulusan
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Lulus', value: analytics.passCount },
                        { name: 'Tidak Lulus', value: analytics.failCount },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Lulus', value: analytics.passCount },
                        { name: 'Tidak Lulus', value: analytics.failCount },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Question Difficulty Analysis */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analisis Tingkat Kesulitan Soal
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No. Soal</TableCell>
                        <TableCell>Pertanyaan</TableCell>
                        <TableCell>Tingkat Kesulitan</TableCell>
                        <TableCell>% Benar</TableCell>
                        <TableCell>Diskriminasi</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questionDifficulty.map(
                        (question: any, index: number) => (
                          <TableRow key={question.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {question.content.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={question.difficulty}
                                color={
                                  question.difficulty === 'Mudah'
                                    ? 'success'
                                    : question.difficulty === 'Sedang'
                                      ? 'warning'
                                      : 'error'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {Math.round(question.correctPercentage)}%
                            </TableCell>
                            <TableCell>
                              {question.discrimination.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedQuestion(question)
                                  setShowDetailDialog(true)
                                }}
                              >
                                Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Time Analysis */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analisis Waktu Pengerjaan
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="minute" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Question Detail Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detail Analisis Soal</DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedQuestion.content}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Statistik:</Typography>
                  <Typography>
                    Dijawab benar: {selectedQuestion.correctCount} siswa
                  </Typography>
                  <Typography>
                    Dijawab salah: {selectedQuestion.incorrectCount} siswa
                  </Typography>
                  <Typography>
                    Tidak dijawab: {selectedQuestion.unansweredCount} siswa
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2">Kualitas Soal:</Typography>
                  <Typography>
                    Tingkat Kesulitan: {selectedQuestion.difficulty}
                  </Typography>
                  <Typography>
                    Daya Diskriminasi:{' '}
                    {selectedQuestion.discrimination.toFixed(2)}
                  </Typography>
                  <Typography>
                    Reliabilitas:{' '}
                    {selectedQuestion.reliability?.toFixed(2) || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              {/* Answer Distribution */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Distribusi Jawaban:
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={selectedQuestion.answerDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="option" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
