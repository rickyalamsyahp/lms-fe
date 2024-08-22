import { Check, Close } from '@mui/icons-material'
import {
  Box,
  BoxProps,
  Chip,
  CircularProgress,
  TableCell,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { roundDecimal } from '../../../../libs/utils'
import { useCourseExamStats } from '../__shared/api'

type CourseExamReportProps = BoxProps & {
  courseExamId: string
  userId?: string
  asTableCell?: boolean
}

export default function CourseExamReport({
  courseExamId,
  userId,
  asTableCell,
  ...props
}: CourseExamReportProps) {
  const { data, mutate: refetch } = useCourseExamStats(
    courseExamId as string,
    userId as string,
    {
      revalidateOnMount: false,
    }
  )

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return asTableCell ? (
    <>
      <TableCell>
        {data ? (
          <Chip
            size="small"
            label={data?.hasFinished ? 'sudah' : 'belum'}
            color={data?.hasFinished ? 'success' : 'default'}
            icon={data?.hasFinished ? <Check /> : <Close />}
          />
        ) : (
          <CircularProgress size={16} />
        )}
      </TableCell>
      <TableCell align="right">
        <Typography>
          {data ? (
            data?.hasFinished ? (
              roundDecimal(data?.avgScore)
            ) : (
              '-'
            )
          ) : (
            <CircularProgress size={16} />
          )}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>
          {data ? (
            data?.hasFinished ? (
              roundDecimal(data?.latestScore as number)
            ) : (
              '-'
            )
          ) : (
            <CircularProgress size={16} />
          )}
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
