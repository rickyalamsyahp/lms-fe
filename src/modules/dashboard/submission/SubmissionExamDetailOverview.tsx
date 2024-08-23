import { Box, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'
import JumpingLoader from '../../../components/shared/JumpingLoader'
import { useSession } from '../../../context/session'
import UserForm from './__components/SubmissionForm'
import { useSubmission } from './__shared/api'

export default function UserDetailOverview() {
  const { submissionId } = useParams()

  const { state } = useSession()
  const { data: user } = useSubmission(
    state.profile.scope,
    submissionId as string
  )

  return user ? (
    <Box maxWidth={'sm'}>
      <Paper>
        <UserForm initialData={user} asDialog={false} />
      </Paper>
    </Box>
  ) : (
    <JumpingLoader />
  )
}
