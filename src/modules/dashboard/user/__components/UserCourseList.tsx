import {
  Box,
  Link,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { options } from '../../../../libs/http'
import FileViewer from '../../../filemeta/__components/FileViewer'
import CourseReport from '../../course/__components/CourseReport'
import { useCourseList } from '../../course/__shared/api'
import { Course } from '../../course/__shared/type'
import CoursetExamList from '../../courseExam/__components/CourseExamList'

type UserCourseListProps = {
  userId?: string
}

export default function UserCourseList({ userId }: UserCourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const [showCourseExamList, setShowCourseExamList] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const { data: courseList } = useCourseList(options.publicScope, {
    page: 1,
    size: 50,
    order: 'asc',
    orderBy: 'level',
    'published:eq': true,
  })

  function handleOpenCourse(d: Course) {
    setSelectedCourse(d)
    setShowFile(true)
  }

  return (
    <Box sx={{ width: '100%', height: 'auto', mb: 2 }}>
      <Paper>
        <TableContainer>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Judul Pembelajaran</TableCell>
              <TableCell rowSpan={2}>Menyelesaikan</TableCell>
              <TableCell rowSpan={2} align="center">
                Nilai (Avg)
              </TableCell>
              <TableCell rowSpan={2} align="center">
                Nilai Terakhir
              </TableCell>
              <TableCell rowSpan={2} align="center">
                Exam
              </TableCell>
              <TableCell align="center" colSpan={4}>
                Submission
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ongoing</TableCell>
              <TableCell>Finished</TableCell>
              <TableCell>Canceled</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseList?.results.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <>
                    <Link
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenCourse(d)}
                    >
                      <Typography sx={{ minWidth: 240 }}>{d.title}</Typography>
                    </Link>
                    <Typography
                      fontSize={12}
                      sx={{ mt: 0.5 }}
                      color="textSecondary"
                    >
                      {d.description}
                    </Typography>
                  </>
                </TableCell>
                <CourseReport
                  userId={userId}
                  courseId={d.id as string}
                  asTableCell
                  onClickExam={() => {
                    setSelectedCourse(d)
                    setShowCourseExamList(true)
                  }}
                />
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Paper>
      <CoursetExamList
        userId={userId}
        course={selectedCourse}
        open={showCourseExamList}
        onClose={() => {
          setShowCourseExamList(false)
          setTimeout(() => setSelectedCourse(undefined), 500)
        }}
      />
      <FileViewer
        fileMeta={selectedCourse?.fileMeta}
        open={showFile}
        onClose={() => {
          setShowFile(false)
          setSelectedCourse(undefined)
        }}
      />
    </Box>
  )
}
