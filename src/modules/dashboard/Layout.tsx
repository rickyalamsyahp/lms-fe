import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AuthProvider from '../../context/auth/Provider'
import SessionProvider from '../../context/session/Provider'

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </SessionProvider>
    </AuthProvider>
  )
}
