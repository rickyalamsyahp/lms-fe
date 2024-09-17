import { Edit } from '@mui/icons-material'
import {
  Avatar,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useState } from 'react'
import { User } from '../../../../context/auth/__shared/type'
import { getUserAvatarUrl } from '../__shared/api'
import UserForm from './UserForm'

type FieldProps = TextFieldProps

type UserInfoProps = {
  user: User
  refetch: any
}

export default function UserInfo({ user, refetch }: UserInfoProps) {
  const [showForm, setShowForm] = useState(false)
  // const { userId } = useParams()

  const fields: FieldProps[] = [
    {
      label: 'Nama',
      value: user.name,
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Username',
      value: user.username,
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Gender',
      value: user.bio?.gender || '-',
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Email',
      value: user.email,
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Nomor Identitas',
      value: user.bio?.identityNumber || '-',
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Nomor Ponsel',
      value: user.bio?.phoneNumber || '-',
      fullWidth: true,
      variant: 'standard',
    },
    {
      label: 'Tanggal Lahir',
      value: user.bio?.born || '-',
      fullWidth: true,
      variant: 'standard',
    },
  ]

  return (
    <>
      <Paper sx={{ p: 2 }}>
        {user ? (
          <Stack flexDirection="row" sx={{ gap: 4 }}>
            <Avatar
              src={getUserAvatarUrl(user.id as string)}
              sx={{ width: 240, height: 240, border: `thin solid #00000022` }}
              variant="square"
            />
            <Stack sx={{ gap: 2, width: '100%' }}>
              {/* <Typography variant="h5">{profile.data.name}</Typography>
              {profile.data.bio?.identityNumber && (
                <Typography variant="body2">
                  {profile.data.bio?.identityNumber}
                </Typography>
              )} */}
              <Stack
                sx={{ width: '100%' }}
                flexDirection={'row'}
                flexWrap={'wrap'}
              >
                {fields.map((d: FieldProps, i: number) => (
                  <TextField
                    key={i}
                    {...d}
                    inputProps={{ readOnly: true }}
                    margin="normal"
                  />
                ))}
              </Stack>
              <div>
                <Button
                  onClick={() => setShowForm(true)}
                  startIcon={<Edit />}
                  variant="contained"
                >
                  Edit Profil
                </Button>
              </div>
            </Stack>
          </Stack>
        ) : (
          <CircularProgress />
        )}
      </Paper>
      <UserForm
        initialData={user}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          refetch()
        }}
      />
    </>
  )
}
