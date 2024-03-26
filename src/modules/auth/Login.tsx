'use client'

import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { login } from '../../context/auth/__shared/api'
import { LoginPayload } from '../../context/auth/__shared/type'
import { cookieNames, setAccessToken } from '../../libs/http'

export default function LoginPage() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState<LoginPayload>({
    username: '',
    password: '',
  })

  function handleChange(key: string, value: string) {
    setPayload((p) => {
      p[key as keyof typeof p] = value
      return { ...p }
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.stopPropagation()
    e.preventDefault()

    const loadingId = toast.loading('melakukan otorisasi...')
    try {
      const res = await login(payload)
      setAccessToken(cookieNames.USER_ACCESS_TOKEN, res.data)
      navigate('/dashboard/submission')
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
      <Container maxWidth={'xs'} sx={{ textAlign: 'center' }}>
        <Paper
          sx={{
            p: 4,
            position: 'relative',
            borderRadius: 2,
            background: '#FFFFFFAD',
          }}
        >
          <img
            src="/hnfh-logo.svg"
            width={120}
            height={120}
            alt="logo"
            style={{
              margin: '0 auto',
            }}
          />
          <Typography variant="h5" sx={{ mt: 1, mb: 6, color: 'primary.main' }}>
            Welcome to <br />
            <strong>Internal Dashboard</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack sx={{ gap: 2 }}>
              <TextField
                label="username"
                inputProps={{ required: true }}
                type="username"
                value={payload.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
              <TextField
                label="password"
                type="password"
                value={payload.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
        <Typography sx={{ mt: 1 }}>
          Powered by <b>AVS</b> Simulator
        </Typography>
      </Container>
    </Stack>
  )
}
