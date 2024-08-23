import { Box, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'
import JumpingLoader from '../../../components/shared/JumpingLoader'
import CourseForm from './__components/CourseForm'
import { useCourse } from './__shared/api'

export default function CourseDetailOverview() {
  const { courseId } = useParams()
  const { data: course } = useCourse(courseId as string)

  return course ? (
    <Box maxWidth={'sm'}>
      <Paper>
        <CourseForm initialData={course} asDialog={false} />
      </Paper>
    </Box>
  ) : (
    <JumpingLoader />
  )
}
