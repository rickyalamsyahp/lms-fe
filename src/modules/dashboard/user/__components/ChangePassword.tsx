import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { changePassword, ChangePasswordBody } from '../__shared/api'
import { User } from '../__shared/type'
import UserCard from './UserCard'

type ChangePasswordProps = {
  user?: User
  isOpen: boolean
  onClose?: () => void
  onSuccess?: () => void
  asDialog?: boolean
}

function resetPayload(): ChangePasswordBody {
  return {
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  }
}

export default function ChangePassword({
  user,
  isOpen,
  onClose = () => {
    return
  },
}: ChangePasswordProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payload, setPayload] = useState<ChangePasswordBody>(resetPayload())

  function handlePayloadChange(key: string, value: string) {
    setPayload((prevPayload: User & any) => {
      prevPayload[key as keyof typeof prevPayload] = value
      return { ...prevPayload }
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.stopPropagation()
    event.preventDefault()
    setIsSubmitting(true)

    const loadingId = toast.loading('merubah password...')

    try {
      if (payload.newPassword !== payload.newPasswordConfirmation)
        throw new Error('Konfirmasi password tidak sesuai!')
      await changePassword(payload, user?.id)
      toast.success(`Berhasil merubah password`, { id: loadingId })
      onClose()
    } catch (error: any) {
      setIsSubmitting(false)
      toast.error(error.message, { id: loadingId })
    }
  }

  useEffect(() => {
    if (isOpen) setPayload(resetPayload())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={isOpen} fullWidth maxWidth={'xs'}>
      <DialogTitle>Ubah Password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack sx={{ gap: 3, mt: 1 }}>
            {user ? (
              <UserCard data={user} />
            ) : (
              <TextField
                label="Password Lama"
                type="password"
                value={payload.oldPassword}
                onChange={(e) =>
                  handlePayloadChange('password', e.target.value)
                }
              />
            )}
            <TextField
              label="Password Baru"
              type="password"
              value={payload.newPassword}
              inputProps={{ minLength: 6 }}
              onChange={(e) =>
                handlePayloadChange('newPassword', e.target.value)
              }
            />
            <TextField
              label="Konfirmasi Password"
              type="password"
              value={payload.newPasswordConfirmation}
              onChange={(e) =>
                handlePayloadChange('newPasswordConfirmation', e.target.value)
              }
            />
            <button id="btn-change-password-submit" hidden />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => {
            document.getElementById('btn-change-password-submit')?.click()
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
