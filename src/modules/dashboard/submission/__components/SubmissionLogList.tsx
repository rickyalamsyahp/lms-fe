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
import { useSubmissionLogList } from '../__shared/api'
import { Submission, SubmissionLog } from '../__shared/type'

type SubmissionLogListProps = DialogProps & {
  onClose: () => void
  submission?: Submission
}

export default function SubmissionLogList({
  onClose,
  submission,
  ...props
}: SubmissionLogListProps) {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showFile, setShowFile] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SubmissionLog | undefined>()
  const { data } = useSubmissionLogList(options.publicScope, submission?.id, {
    page,
    size,
  })

  function handleOpenFile(d: SubmissionLog) {
    setSelectedItem(d)
    setShowFile(true)
  }

  return (
    <>
      <Dialog fullWidth maxWidth={'md'} onClose={onClose} {...props}>
        <DialogTitle>Daftar Submission Log</DialogTitle>
        <DialogContent>
          <DataTable
            fit={false}
            data={data?.results || []}
            columns={[
              {
                label: 'Filename',
                render: (item: SubmissionLog) => (
                  <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenFile(item)}
                  >
                    <Typography>
                      {item.fileMeta?.originalname || item.fileMeta?.filename}
                    </Typography>
                  </Link>
                ),
              },
              {
                label: 'Tag',
                render: (item: SubmissionLog) => (
                  <Typography>{item.tag}</Typography>
                ),
              },
              {
                label: 'Tanggal',
                render: (item: SubmissionLog) => (
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
              onRowsPerPageChange: (e) => setSize(Number(e.target.value)),
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
