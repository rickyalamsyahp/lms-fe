import { Close } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getBase64 } from '../../libs/utils'

type InputFileProps = {
  label?: string
  onChange?: (file?: File) => void
  defaultPreviewImage?: string
  accept?: string
}

export default function InputFile({
  label = 'Select Image',
  onChange,
  defaultPreviewImage,
  accept = 'image/*',
  ...props
}: InputFileProps) {
  const [previewImage, setPreviewImage] = useState<any>(defaultPreviewImage)
  const [filename, setFilename] = useState()

  async function handleChange(e: any) {
    const file = e.target.files[0]
    setFilename(file?.name)
    if (onChange) onChange(file)
    if (file.type.includes('image')) {
      const preview = await getBase64(file)
      setPreviewImage(preview)
    }
  }

  useEffect(() => {
    setPreviewImage(defaultPreviewImage)
  }, [defaultPreviewImage])

  return (
    <Box
      {...props}
      sx={{
        p: 1,
        border: `thin solid rgba(0,0,0,.24)`,
        borderRadius: 1.5,
        display: 'inline-block',
        position: 'relative',
        maxWidth: 160,
      }}
    >
      {previewImage ? (
        <>
          <IconButton
            onClick={() => {
              setPreviewImage(null)
              if (onChange) onChange()
            }}
            sx={{ position: 'absolute', right: 2, top: 2 }}
          >
            <Close />
          </IconButton>
          <img
            src={previewImage}
            alt="preview-image"
            width={300}
            height={300}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          />
        </>
      ) : filename ? (
        <Typography fontSize={12} color={'textSecondary'} sx={{ mb: 1 }}>
          {filename}
        </Typography>
      ) : null}
      <Button variant="contained" component="label" size="small" fullWidth>
        <input type="file" hidden onChange={handleChange} accept={accept} />
        <Typography>{label}</Typography>
      </Button>
    </Box>
  )
}
