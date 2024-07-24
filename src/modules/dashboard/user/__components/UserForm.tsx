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
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InputFile from '../../../../components/shared/InputFile'
import { ScopeSlug } from '../../../../context/auth/__shared/type'
import { useSession } from '../../../../context/session'
import {
  changeAvatar,
  createUser,
  getUserAvatarUrl,
  updateUser,
} from '../__shared/api'
import { User } from '../__shared/type'

type UserFromProps = {
  initialData?: User
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: () => void
  scope?: ScopeSlug
  asDialog?: boolean
} & BoxProps

const defaultValue: User = {
  name: '',
  email: '',
  username: '',
  scope: ScopeSlug.INSTRUCTOR,
}

export default function UserForm({
  initialData,
  isOpen,
  onClose = () => {
    return
  },
  onSuccess,
  scope = ScopeSlug.INSTRUCTOR,
  asDialog = true,
  ...boxProps
}: UserFromProps) {
  const { isMobile } = useSession()
  const [payload, setPayload] = useState<User>(defaultValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState<string>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()

  useEffect(() => {
    if (isOpen || !asDialog) {
      setAvatarFile(undefined)
      setPayload(initialData || defaultValue)
    }
  }, [initialData, isOpen, asDialog])

  async function handleSubmit(event: FormEvent) {
    event.stopPropagation()
    event.preventDefault()
    setIsSubmitting(true)

    const loadingId = toast.loading(
      initialData ? 'memperbaharui akun pengguna' : 'mendaftarkan akun pengguna'
    )
    try {
      if (payload.password !== confirmPassword)
        throw new Error('Konsfirmasi password tidak sesuai')

      const res = await (initialData
        ? updateUser(initialData?.id as string, payload)
        : createUser({ ...payload, scope }))

      if (avatarFile) {
        await changeAvatar(payload.id as string, avatarFile)
      }

      setIsSubmitting(false)
      setPayload({ ...res.data })
      toast.success(
        `Berhasil ${initialData ? 'data akun pengguna berhasil diperbaharui' : 'mendaftarkan akun pengguna'}`,
        { id: loadingId }
      )
      if (onSuccess) onSuccess()
      onClose()
    } catch (error: any) {
      setIsSubmitting(false)
      toast.error(error.message, { id: loadingId })
    }
  }

  function handlePayloadChange(key: string, value: string) {
    const keys = key.split('.')
    const newKey = keys.length > 1 ? keys[1] : keys[0]
    const parentKey = keys.length > 1 ? keys[0] : undefined
    setPayload((prevPayload: User & any) => {
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

  const content = (
    <>
      <form onSubmit={handleSubmit}>
        <Stack sx={{ gap: 3, mt: 1 }}>
          {initialData && (
            <>
              <InputFile
                label="Avatar"
                onChange={(file?: File) => {
                  setAvatarFile(file)
                }}
                defaultPreviewImage={
                  payload.avatar && payload.id
                    ? getUserAvatarUrl(payload.id)
                    : undefined
                }
              />
            </>
          )}
          <TextField
            label="Name"
            value={payload.name}
            onChange={(e) => handlePayloadChange('name', e.target.value)}
            inputProps={{ required: true }}
            required
          />
          <TextField
            label="Email"
            value={payload.email}
            onChange={(e) => handlePayloadChange('email', e.target.value)}
            type="email"
            inputProps={{ required: true }}
          />
          <TextField
            label="Username"
            value={payload.username}
            onChange={(e) =>
              handlePayloadChange(
                'username',
                e.target.value.toLowerCase().replace(/ /gi, '_')
              )
            }
            inputProps={{ required: true }}
            disabled={initialData ? true : false}
          />
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal Lahir"
              value={payload.bio?.born ? dayjs(payload.bio.born) : null}
              onChange={(e: any) =>
                handlePayloadChange('bio.born', e.format('YYYY-MM-DD'))
              }
              sx={{ width: '100%' }}
              minDate={dayjs()}
            />
          </LocalizationProvider>
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
            <>
              <TextField
                label="Password"
                type="password"
                value={payload.password}
                onChange={(e) =>
                  handlePayloadChange('password', e.target.value)
                }
              />
              <TextField
                label="Konfirmasi Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
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
      <DialogTitle>Form Pengguna</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{action}</DialogActions>
    </Dialog>
  ) : (
    <Box sx={{ p: 2 }} maxWidth={'xs'} {...boxProps}>
      {content}
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'flex-end'}
        sx={{ gap: 2, mt: 4 }}
      >
        {action}
      </Stack>
    </Box>
  )
}
