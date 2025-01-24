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

import { ScopeSlug } from '../../../../context/auth/__shared/type'
import { useSession } from '../../../../context/session'
import { createCategory, updateCategory } from '../__shared/api'
import { Category } from '../__shared/type'

type CategoryFormProps = {
  initialData?: Category
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: () => void
  scope?: ScopeSlug
  asDialog?: boolean
  category?: any
} & BoxProps

const defaultValue: Category = {
  name: ''
}

export default function LessonForm({
  initialData,
  isOpen,
  onClose = () => {
    return
  },
  onSuccess,
  asDialog = true,
  ...boxProps
}: CategoryFormProps) {
  const { isMobile, state } = useSession()
  const [payload, setPayload] = useState<Category>(defaultValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen || !asDialog) {
      if (initialData) {
        setPayload(initialData)
      } else {
        setPayload({
          name: ''
        })
      }

    }
  }, [initialData, isOpen, asDialog])

  async function handleSubmit(event: FormEvent) {
    event.stopPropagation()
    event.preventDefault()
    setIsSubmitting(true)

    const loadingId = toast.loading(
      initialData ? 'memperbaharui category' : 'mendaftarkan category'
    )

    try {
      await (initialData
        ? updateCategory(initialData?.id as string, payload)
        : createCategory(payload))

      // if (avatarFile) {
      //   await changeAvatar(payload.id as string, avatarFile)
      // }

      setIsSubmitting(false)
      setPayload({
        name: '',
      })
      toast.success(
        `Berhasil ${initialData ? 'data category berhasil diperbaharui' : 'mendaftarkan category'}`,
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
    setPayload((prevPayload: Category & any) => {
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
            label="Nama"
            value={payload.name}
            onChange={(e) => handlePayloadChange('name', e.target.value)}
            inputProps={{ required: true, readOnly: !editable }}
            required
          />
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
      <DialogTitle>Form Modul Category</DialogTitle>
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
