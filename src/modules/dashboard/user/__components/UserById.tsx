import { Box, Typography } from '@mui/material'
import { useUser } from '../__shared/api'

type UserByIdProps = {
  id: string
}

export default function UserById({ id }: UserByIdProps) {
  const { data: user } = useUser(id !== 'system' ? (id as string) : '')

  return (
    <Box>
      <Typography>{id === 'system' ? 'system' : user?.name}</Typography>
    </Box>
  )
}
