import { Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useSession } from '../../../context/session'
import SubmissionList from '../submission/SubmissionList'
import UserCourseList from './__components/UserCourseList'

export default function UserDetailReport() {
  const { userId } = useParams()
  const { state } = useSession()
  return (
    <Stack sx={{ gap: 2, py: 2, px: 2 }}>
      <Typography variant="h6">Riwayat Aktifitas</Typography>
      <UserCourseList userId={userId || state.profile.id} />
      <Typography variant="h6">Daftar Submission</Typography>
      <SubmissionList asPage={false} owner={userId} />
    </Stack>
  )
}
