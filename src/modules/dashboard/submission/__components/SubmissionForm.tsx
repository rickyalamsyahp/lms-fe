import {
  Box,
  BoxProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { ScopeSlug } from '../../../../context/auth/__shared/type'
import { useSession } from '../../../../context/session'

import { Submission } from '../__shared/type'

type UserFromProps = {
  initialData?: Submission
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: () => void
  scope?: ScopeSlug
  asDialog?: boolean
} & BoxProps

const defaultValue: Submission = {
  courseId: '',
  courseExamId: '',
  owner: '',
  status: '',
  objectType: '',
  score: '',
  exam: {},
}

export default function CourseForm({
  initialData,
  isOpen,
  asDialog = true,
  ...boxProps
}: UserFromProps) {
  const { isMobile } = useSession()
  const [payload, setPayload] = useState<Submission>(defaultValue)

  useEffect(() => {
    if (isOpen || !asDialog) {
      setPayload(initialData || defaultValue)
    }
  }, [initialData, isOpen, asDialog])

  const content = (
    <>
      <form>
        <Stack sx={{ gap: 3, mt: 1 }}>
          <TextField
            label="Course Id"
            value={payload.courseId}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="Course Exam Id"
            value={payload.courseExamId}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="Owner"
            value={payload.owner}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="Status"
            value={payload.status}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="objectType"
            value={payload.objectType}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="Score"
            value={payload.score}
            inputProps={{ required: true }}
            disabled
          />
          <TextField
            label="Course"
            value={JSON.stringify(payload.exam)}
            multiline
            rows={4}
            inputProps={{ required: true }}
            disabled
          />
          <Divider />

          {initialData ? (
            <>
              <TextField label="Dibuat" value={payload.createdBy} disabled />
              <TextField
                label="Tanggal Dibuat"
                value={dayjs(payload.createdAt).format('DD MMM YYYY HH.mm.ss')}
                disabled
              />
              <TextField
                label="Dimodifikasi"
                value={payload.modifiedBy}
                disabled
              />
              <TextField
                label="Tanggal Modifikasi"
                value={dayjs(payload.modifiedAt).format('DD MMM YYYY HH.mm.ss')}
                disabled
              />
            </>
          ) : (
            <></>
          )}
        </Stack>
        <button id="btn-user-form-submit" hidden />
      </form>
    </>
  )

  return asDialog ? (
    <Dialog
      open={isOpen ?? false}
      fullScreen={isMobile}
      fullWidth={true}
      maxWidth={'xs'}
    >
      <DialogTitle>Form Course</DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  ) : (
    <Box sx={{ p: 2 }} maxWidth={'xs'} {...boxProps}>
      {content}
    </Box>
  )
}
