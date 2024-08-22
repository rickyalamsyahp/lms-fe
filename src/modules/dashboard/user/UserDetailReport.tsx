import { Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import SubmissionList from '../submission/SubmissionList'
import UserCourseList from './__components/UserCourseList'

export default function UserDetailReport() {
  const { userId } = useParams()
  return (
    <Stack sx={{ gap: 2, py: 2, px: 2 }}>
      <Typography variant="h6">Riwayat Aktifitas</Typography>
      <UserCourseList userId={userId} />
      <Typography variant="h6">Daftar Submission</Typography>
      <SubmissionList asPage={false} owner={userId} />
    </Stack>
  )
}
