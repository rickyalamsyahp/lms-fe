import { Avatar, Box, BoxProps, Stack, Switch, Typography } from '@mui/material'
import { API_URL } from '../../../../libs/env'
import { User } from '../__shared/type'

type UserCardProps = BoxProps & {
  data: User
  onActivate: () => void
}

export default function UserCard({
  data,
  sx,
  onActivate,
  onClick,
  ...props
}: UserCardProps) {
  return (
    <Box
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'row',
        background: '#E6E6E68A',
        alignItems: 'center',
        py: 2,
        px: 2,
        borderBottom: 'thin solid #0000001A',
        borderRadius: 4,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
        }}
        onClick={onClick}
      >
        <Avatar
          sx={{ mr: 2 }}
          src={
            data.avatar
              ? `${API_URL}/public/user/avatar/${data.avatar}`
              : undefined
          }
        >
          <Typography textTransform={'capitalize'}>
            {data.name.charAt(0)}
          </Typography>
        </Avatar>
        <Box>
          <Typography>{data.name}</Typography>
          <Stack flexDirection={'row'} alignItems={'center'}>
            <Typography fontSize={14}>{data.email}</Typography>
          </Stack>
        </Box>
      </Box>
      <Switch checked={data.isActive} onChange={() => onActivate()} />
    </Box>
  )
}
