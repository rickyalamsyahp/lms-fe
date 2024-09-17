import { Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { User } from '../../../context/auth/__shared/type'
import { useSession } from '../../../context/session'
import SubmissionList from '../submission/SubmissionList'
import UserCourseList from './__components/UserCourseList'
import UserInfo from './__components/UserInfo'
import { useUser } from './__shared/api'

type UserDetailReport = {
  user?: User
}

export default function UserDetailReport({ user }: UserDetailReport) {
  const { state } = useSession()
  const { userId } = useParams()
  const { data, mutate: refetch } = useUser(userId as string)

  return (
    <Stack sx={{ gap: 2, py: 2, px: 2 }}>
      <Typography variant="h6">Profil</Typography>
      {(user || data) && (
        <UserInfo user={(user || data) as User} refetch={refetch} />
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Riwayat Aktifitas
      </Typography>
      <UserCourseList userId={userId || state.profile?.id} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Daftar Submission
      </Typography>
      <SubmissionList asPage={false} owner={userId} />
    </Stack>
  )
}
