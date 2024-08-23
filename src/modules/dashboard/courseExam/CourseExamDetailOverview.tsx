import { Box, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'
import JumpingLoader from '../../../components/shared/JumpingLoader'
import { useSession } from '../../../context/session'
import CourseExamForm from './__components/CourseExamForm'
import { useCourseExam } from './__shared/api'

export default function UserDetailOverview() {
  const { examId } = useParams()
  const { state } = useSession()
  const { data: user } = useCourseExam(state.profile.scope, examId as string)

  return user ? (
    <Box maxWidth={'sm'}>
      <Paper>
        <CourseExamForm initialData={user} asDialog={false} />
      </Paper>
    </Box>
  ) : (
    <JumpingLoader />
  )
}
