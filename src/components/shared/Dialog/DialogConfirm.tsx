import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'

type DialogConfirmProps = DialogProps & {
  title?: string
  content: string
  okText?: string
  cancelText?: string
  onSubmit: any
  onClose: () => void
}

export function DialogConfirm({
  title,
  content,
  onClose,
  onSubmit,
  okText = 'Ya',
  cancelText = 'Batal',
  ...dialogProps
}: DialogConfirmProps) {
  const [loading, setLoading] = useState(false)
  async function handleClose(agree = false) {
    try {
      if (agree) {
        setLoading(true)
        await onSubmit()
        onClose()
        setLoading(false)
      } else {
        onClose()
      }
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  return (
    <Dialog
      {...dialogProps}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={() => handleClose(true)}
          autoFocus
          disabled={loading}
          variant="contained"
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
