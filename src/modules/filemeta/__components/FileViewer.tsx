import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material'
import { API_URL } from '../../../libs/env'
import { FileMeta } from '../__shared/type'

type FileViewerProps = DialogProps & {
  fileMeta?: FileMeta
  onClose: () => void
}

export default function FileViewer({
  fileMeta,
  onClose,
  ...props
}: FileViewerProps) {
  function getFileSrc() {
    return `${API_URL}/file/${fileMeta?.filename}`
  }

  return (
    <Dialog fullScreen onClose={onClose} {...props}>
      <DialogTitle>{fileMeta?.originalname}</DialogTitle>
      <DialogContent>
        {fileMeta ? (
          fileMeta?.mimetype.includes('image') ? (
            <img src={getFileSrc()} alt={fileMeta.originalname} />
          ) : fileMeta?.mimetype.includes('video') ? (
            <video
              title={fileMeta.originalname}
              controls
              style={{ width: '100%', height: '100%' }}
            >
              <source src={getFileSrc()} type={fileMeta.mimetype} />
            </video>
          ) : (
            <object
              data={getFileSrc()}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                Alternative text - include a link{' '}
                <a href={getFileSrc()}>to the PDF!</a>
              </p>
            </object>
          )
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  )
}
