import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

function ExamResultDetail({ result }: any) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informasi Ujian
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Judul Ujian
                </Typography>
                <Typography>{result.questionBank?.title}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mata Pelajaran
                </Typography>
                <Typography>{result.questionBank?.subject?.nama}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Kelas
                </Typography>
                <Typography>{result.questionBank?.classroom?.nama}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Guru
                </Typography>
                <Typography>{result.questionBank?.teacher?.nama}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hasil Ujian
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Nilai
                </Typography>
                <Typography fontWeight="bold" variant="h5">
                  {result.score}/{result.totalPoints}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Persentase
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight="bold">
                    {Math.round(result.percentage)}%
                  </Typography>
                  <Chip
                    label={result.percentage >= 75 ? 'LULUS' : 'TIDAK LULUS'}
                    color={result.percentage >= 75 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Durasi Pengerjaan
                </Typography>
                <Typography>
                  {result.duration
                    ? `${Math.floor(result.duration / 60)} menit ${result.duration % 60} detik`
                    : '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Waktu Submit
                </Typography>
                <Typography>
                  {result.submittedAt
                    ? new Date(result.submittedAt).toLocaleString('id-ID')
                    : '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={
                    result.status === 'submitted'
                      ? 'Submit Manual'
                      : result.status === 'auto_submitted'
                        ? 'Auto Submit'
                        : result.status
                  }
                  color={
                    result.status.includes('submitted') ? 'success' : 'default'
                  }
                  size="small"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
export default ExamResultDetail
