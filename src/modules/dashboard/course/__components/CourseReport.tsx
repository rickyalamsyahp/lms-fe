import {
  Box,
  BoxProps,
  Chip,
  CircularProgress,
  TableCell,
  Typography,
} from '@mui/material'
import { roundDecimal } from '../../../../libs/utils'
import { useCourseStats } from '../__shared/api'

type CourseReportProps = BoxProps & {
  courseId: string
  userId?: string
  asTableCell?: boolean
}

export default function CourseReport({
  courseId,
  userId,
  asTableCell,
  ...props
}: CourseReportProps) {
  const { data } = useCourseStats(courseId as string, userId as string)
  return asTableCell ? (
    <>
      <TableCell>
        {data ? (
          <Chip
            size="small"
            label={data?.hasFinished ? 'sudah' : 'belum'}
            color={data?.hasFinished ? 'success' : 'default'}
          />
        ) : (
          <CircularProgress size={16} />
        )}
      </TableCell>
      <TableCell align="right">
        <Typography>
          {data ? roundDecimal(data?.avgScore) : <CircularProgress size={16} />}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>
          {data ? (
            roundDecimal(data?.latestScore as number)
          ) : (
            <CircularProgress size={16} />
          )}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>
          {`${data?.progress?.totalFinishedExam} / ${data?.progress?.totalExam}`}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{data?.submission.ongoing}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{data?.submission.finished}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{data?.submission.canceled}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{data?.submission.total}</Typography>
      </TableCell>
    </>
  ) : (
    <Box {...props}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  )
}
