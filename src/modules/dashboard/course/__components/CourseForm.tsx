import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from '@mui/material'
import dayjs from 'dayjs'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InputFile from '../../../../components/shared/InputFile'

import { ScopeSlug } from '../../../../context/auth/__shared/type'
import { useSession } from '../../../../context/session'
import { createCours, updateCours } from '../__shared/api'
import { Course } from '../__shared/type'

type UserFromProps = {
  initialData?: Course
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: () => void
  scope?: ScopeSlug
  asDialog?: boolean
} & BoxProps

const defaultValue: Course = {
  description: '',
  title: '',
  file: null,
  level: '1',
}

export default function CourseForm({
  initialData,
  isOpen,
  onClose = () => {
    return
  },
  onSuccess,
  asDialog = true,
  ...boxProps
}: UserFromProps) {
  const { isMobile, state } = useSession()
  const [payload, setPayload] = useState<Course>(defaultValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen || !asDialog) {
      setPayload(initialData || defaultValue)
    }
  }, [initialData, isOpen, asDialog])

  async function handleSubmit(event: FormEvent) {
    event.stopPropagation()
    event.preventDefault()
    setIsSubmitting(true)

    const loadingId = toast.loading(
      initialData ? 'memperbaharui course' : 'mendaftarkan course'
    )
    const formData = new FormData()
    formData.append('title', payload.title || '')
    formData.append('description', payload.description || '')
    formData.append('level', payload.level || '')
    if (payload.file) {
      formData.append('file', payload.file)
    }
    try {
      const res = await (initialData
        ? updateCours(initialData?.id as string, formData)
        : createCours(formData))

      // if (avatarFile) {
      //   await changeAvatar(payload.id as string, avatarFile)
      // }

      setIsSubmitting(false)
      setPayload({ ...res.data })
      toast.success(
        `Berhasil ${initialData ? 'data course berhasil diperbaharui' : 'mendaftarkan course'}`,
        { id: loadingId }
      )
      if (onSuccess) onSuccess()
      onClose()
    } catch (error: any) {
      setIsSubmitting(false)
      toast.error(error.message, { id: loadingId })
    }
  }

  function handlePayloadChange(key: string, value: any) {
    const keys = key.split('.')
    const newKey = keys.length > 1 ? keys[1] : keys[0]
    const parentKey = keys.length > 1 ? keys[0] : undefined
    setPayload((prevPayload: Course & any) => {
      if (parentKey) {
        prevPayload[parentKey as keyof typeof prevPayload] =
          prevPayload[parentKey as keyof typeof prevPayload] || {}
        prevPayload[parentKey as keyof typeof prevPayload][
          newKey as keyof typeof prevPayload
        ] = value
      } else {
        prevPayload[newKey as keyof typeof prevPayload] = value
      }

      return { ...prevPayload }
    })
  }

  const editable = state.isAdmin

  const content = (
    <>
      <form onSubmit={handleSubmit}>
        <Stack sx={{ gap: 3, mt: 1 }}>
          <TextField
            label="Judul"
            value={payload.title}
            onChange={(e) => handlePayloadChange('title', e.target.value)}
            inputProps={{ required: true, readOnly: !editable }}
            required
          />
          <TextField
            label="Deskripsi"
            value={payload.description}
            onChange={(e) => handlePayloadChange('description', e.target.value)}
            multiline
            rows={4}
            inputProps={{ required: true, readOnly: !editable }}
            required
          />
          <TextField
            label="Level"
            value={payload.level}
            onChange={(e) => {
              const newLevel = Number(e.target.value)
              handlePayloadChange(
                'level',
                String(newLevel < 1 ? 1 : e.target.value)
              )
            }}
            inputProps={{ required: true, readOnly: !editable }}
            type="number"
            required
          />
          {editable && (
            <InputFile
              label="File Upload"
              accept="*.*"
              onChange={(file?: File) => {
                console.log(file)
                handlePayloadChange('file', file)
              }}
            />
          )}
          {/* <TextField
            label="File"
            value={payload.username}
            onChange={(e) =>
              handlePayloadChange(
                'username',
                e.target.value.toLowerCase().replace(/ /gi, '_')
              )
            }
            inputProps={{ required: true }}
            disabled={initialData ? true : false}
          /> */}
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

  const action = (
    <>
      {asDialog && (
        <Button onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={() => {
          document.getElementById('btn-user-form-submit')?.click()
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading...' : 'Simpan'}
      </Button>
    </>
  )

  return asDialog ? (
    <Dialog
      open={isOpen ?? false}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          if (!isSubmitting) {
            onClose()
          }
        } else {
          onClose()
        }
      }}
      fullScreen={isMobile}
      fullWidth={true}
      maxWidth={'xs'}
    >
      <DialogTitle>Form Modul Pembelajaran</DialogTitle>
      <DialogContent>{content}</DialogContent>
      {editable && <DialogActions>{action}</DialogActions>}
    </Dialog>
  ) : (
    <Box sx={{ p: 2 }} maxWidth={'xs'} {...boxProps}>
      {content}
      {editable && (
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          sx={{ gap: 2, mt: 4 }}
        >
          {action}
        </Stack>
      )}
    </Box>
  )
}
