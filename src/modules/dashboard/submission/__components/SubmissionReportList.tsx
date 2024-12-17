import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import DataTable from '../../../../components/shared/DataTable'
import { options } from '../../../../libs/http'
import FileViewer from '../../../filemeta/__components/FileViewer'
import { useSubmissionReportList } from '../__shared/api'
import { Submission, SubmissionReport } from '../__shared/type'

type SubmissionReportListProps = DialogProps & {
  onClose: () => void
  submission?: Submission
}

export default function SubmissionReportList({
  onClose,
  submission,
  ...props
}: SubmissionReportListProps) {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showFile, setShowFile] = useState(false)
  const [selectedItem, setSelectedItem] = useState<
    SubmissionReport | undefined
  >()
  const { data } = useSubmissionReportList(
    options.publicScope,
    submission?.id,
    {
      page,
      size,
    }
  )

  function handleOpenFile(d: SubmissionReport) {
    setSelectedItem(d)
    setShowFile(true)
  }

  return (
    <>
      <Dialog fullWidth maxWidth={'md'} onClose={onClose} {...props}>
        <DialogTitle>Daftar Submission Report</DialogTitle>
        <DialogContent>
          <DataTable
            fit={false}
            data={data?.results || []}
            columns={[
              {
                label: 'Filename',
                render: (item: SubmissionReport) => (
                  <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenFile(item)}
                  >
                    <Typography>{item.fileMeta.originalname}</Typography>
                  </Link>
                ),
              },
              {
                label: 'Tag',
                render: (item: SubmissionReport) => (
                  <Typography>{item.tag}</Typography>
                ),
              },
              {
                label: 'Tanggal',
                render: (item: SubmissionReport) => (
                  <Typography>
                    {dayjs(item.createdAt).toDate().toLocaleString()}
                  </Typography>
                ),
              },
            ]}
            paginationProps={{
              rowsPerPageOptions: [10, 25, 50],
              rowsPerPage: size,
              count: Number(data?.total || 0),
              page,
              onPageChange: (e, value) => setPage(value + 1),
              onRowsPerPageChange: (e) => {
                setSize(Number(e.target.value))
                setPage(1)
            },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Tutup</Button>
        </DialogActions>
      </Dialog>
      <FileViewer
        fileMeta={selectedItem?.fileMeta}
        open={showFile}
        onClose={() => {
          setShowFile(false)
          setSelectedItem(undefined)
        }}
      />
    </>
  )
}
