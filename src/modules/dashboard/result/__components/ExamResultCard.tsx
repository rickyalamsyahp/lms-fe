import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material'

function ExamResultCard({ result }: any) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'success'
    if (percentage >= 70) return 'warning'
    return 'error'
  }
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
          <Box>
            <Typography variant="h6">{result.questionBank?.title}</Typography>
            <Typography color="text.secondary">
              {result.questionBank?.subject?.nama}
            </Typography>
          </Box>
          <Chip
            label={`${Math.round(result.percentage)}%`}
            color={getScoreColor(result.percentage)}
            size="small"
          />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Nilai
            </Typography>
            <Typography fontWeight="bold">
              {result.score}/{result.totalPoints}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Durasi
            </Typography>
            <Typography>
              {result.duration
                ? `${Math.floor(result.duration / 60)} menit`
                : '-'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ExamResultCard
