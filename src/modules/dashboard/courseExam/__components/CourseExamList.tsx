import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { options } from '../../../../libs/http'
import { ellipsis } from '../../../../libs/utils'
import FileViewer from '../../../filemeta/__components/FileViewer'
import { Course } from '../../course/__shared/type'
import { getCourseExamList } from '../__shared/api'
import { CourseExam } from '../__shared/type'
import CourseExamReport from './CourseExamReport'

type CourseExamListProps = DialogProps & {
  course?: Course
  userId?: string
  onClose: () => void
}

export default function CoursetExamList({
  course,
  userId,
  onClose,
  ...props
}: CourseExamListProps) {
  const [selectedCourseExam, setSelectedCourseExam] = useState<CourseExam>()
  const [showFile, setShowFile] = useState(false)
  const [examList, setExamList] = useState<{
    results: CourseExam[]
    total: string
  }>()
  async function fetchData() {
    try {
      const res = await getCourseExamList(options.publicScope, {
        page: 1,
        size: 50,
        'courseId:eq': course?.id,
        orderBy: 'level',
        order: 'asc',
      })
      setExamList(res.data)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  function handleClose() {
    if (onClose) onClose()
  }

  function handleOpenCourse(d: Course) {
    setSelectedCourseExam(d)
    setShowFile(true)
  }

  useEffect(() => {
    if (course) fetchData()
    else setExamList(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  return (
    <>
      <Dialog fullWidth maxWidth={'md'} onClose={handleClose} {...props}>
        <DialogTitle>
          {course && ellipsis(course?.title as string, 32)}
        </DialogTitle>
        <DialogContent>
          <Paper>
            <TableContainer>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2}>Judul Exam</TableCell>
                  <TableCell rowSpan={2}>Level</TableCell>
                  <TableCell rowSpan={2}>Menyelesaikan</TableCell>
                  <TableCell rowSpan={2} align="center">
                    Nilai (Avg)
                  </TableCell>
                  <TableCell rowSpan={2} align="center">
                    Nilai Terakhir
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
                {examList?.results.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <>
                        {d.fileMeta ? (
                          <Link
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleOpenCourse(d)}
                          >
                            <Typography sx={{ minWidth: 240 }}>
                              {d.title}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography sx={{ minWidth: 240 }}>
                            {d.title}
                          </Typography>
                        )}
                        <Typography
                          fontSize={12}
                          sx={{ mt: 0.5 }}
                          color="textSecondary"
                        >
                          {d.description}
                        </Typography>
                      </>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>{d.level}</Typography>
                    </TableCell>
                    <CourseExamReport
                      userId={userId}
                      courseExamId={d.id as string}
                      asTableCell
                    />
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Tutup</Button>
        </DialogActions>
      </Dialog>
      <FileViewer
        fileMeta={selectedCourseExam?.fileMeta}
        open={showFile}
        onClose={() => {
          setShowFile(false)
          setSelectedCourseExam(undefined)
        }}
      />
    </>
  )
}
