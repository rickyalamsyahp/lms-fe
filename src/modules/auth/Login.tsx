'use client'

import {
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { login } from '../../context/auth/__shared/api'
import {
  LOGIN_LOGO_HEIGHT,
  LOGIN_LOGO_WIDTH,
  LOGO,
  TITLE,
} from '../../libs/env'
import { cookieNames, setAccessToken } from '../../libs/http'

const tahunPelajaranList = ['2022-2023', '2023-2024', '2024-2025']

type Role = 'siswa' | 'guru'

export default function LoginPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState<Role>('siswa')
  const [thnPelajaran, setThnPelajaran] = useState(tahunPelajaranList[0])
  const [fields, setFields] = useState({
    nis: '',
    nisn: '',
    uidg: '',
    upwdg: '',
  })

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const loadingId = toast.loading('melakukan otorisasi...')

    try {
      const payload =
        role === 'siswa'
          ? {
              nis: fields.nis,
              nisn: fields.nisn,
              thn_pelajaran: thnPelajaran,
            }
          : {
              uidg: fields.uidg,
              upwdg: fields.upwdg,
              thn_pelajaran: thnPelajaran,
            }

      const res: any = await login(payload)
      // console.log(res)

      setAccessToken(cookieNames.USER_ACCESS_TOKEN, res.data.accessToken)
      navigate('/dashboard')
      toast.remove(loadingId)
    } catch (error: any) {
      toast.error(error.message, { id: loadingId })
    }
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/bg-pattern.png")',
      }}
    >
      <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
        <Paper
          sx={{
            p: 5,
            borderRadius: 2,
            background: '#f6f6f6',
          }}
        >
          <img
            src={LOGO}
            width={LOGIN_LOGO_WIDTH}
            height={LOGIN_LOGO_HEIGHT}
            alt="logo"
            style={{ margin: '0 auto' }}
          />
          <Typography variant="h5" sx={{ mt: 1, mb: 2, color: 'primary.main' }}>
            Welcome to <br />
            <strong>{TITLE}</strong>
          </Typography>

          {/* Toggle Role */}
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(_, newRole: Role) => newRole && setRole(newRole)}
            sx={{ mb: 3 }}
            fullWidth
          >
            <ToggleButton value="siswa">Siswa</ToggleButton>
            <ToggleButton value="guru">Guru</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <Stack gap={2}>
              {role === 'siswa' ? (
                <>
                  <TextField
                    label="NIS"
                    value={fields.nis}
                    onChange={(e) => handleFieldChange('nis', e.target.value)}
                    required
                  />
                  <TextField
                    label="NISN"
                    value={fields.nisn}
                    onChange={(e) => handleFieldChange('nisn', e.target.value)}
                    required
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Username Guru"
                    value={fields.uidg}
                    onChange={(e) => handleFieldChange('uidg', e.target.value)}
                    required
                  />
                  <TextField
                    label="Password Guru"
                    type="password"
                    value={fields.upwdg}
                    onChange={(e) => handleFieldChange('upwdg', e.target.value)}
                    required
                  />
                </>
              )}

              {/* Tahun Pelajaran */}
              <Select
                value={thnPelajaran}
                onChange={(e) => setThnPelajaran(e.target.value)}
                fullWidth
              >
                {tahunPelajaranList.map((tahun) => (
                  <MenuItem key={tahun} value={tahun}>
                    {tahun}
                  </MenuItem>
                ))}
              </Select>

              <Button variant="contained" type="submit">
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Stack>
  )
}
