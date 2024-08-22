import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import UserCourseList from './__components/UserCourseList'

export default function UserDetailReport() {
  const { userId } = useParams()
  return (
    <Box>
      <UserCourseList userId={userId} />
    </Box>
  )
}
